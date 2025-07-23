import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import copy from 'copy-to-clipboard';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useTranslation } from 'mirador';
import EmbedSizeIcon from './EmbedSizeIcon';

const CopyToClipboardButton = ({
  children, onClick, text, ...props
}) => {
  const handleClick = (e) => {
    copy(text);
    onClick(e);
  };

  return (
    <Button
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
};

CopyToClipboardButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

const sizes = {
  small: {
    iconWidth: 70,
    iconHeight: 52,
    viewerWidth: 560,
    viewerHeight: 420,
  },
  medium: {
    iconWidth: 80,
    iconHeight: 60,
    viewerWidth: 640,
    viewerHeight: 480,
  },
  large: {
    iconWidth: 90,
    iconHeight: 67,
    viewerWidth: 800,
    viewerHeight: 600,
  },
  extraLarge: {
    iconWidth: 100,
    iconHeight: 75,
    viewerWidth: 1024,
    viewerHeight: 768,
  },
};

/**
 * MiradorShareEmbed ~
*/
function MiradorShareEmbed({
  embedIframeAttributes,
  embedIframeTitle,
  embedUrlReplacePattern,
  manifestId = null,
  syncIframeDimensions = {},
}) {
  const [selectedSize, setSelectedSize] = useState('small');
  const { t } = useTranslation();

  function formControlLabelsForSizes() {
    return Object.keys(sizes).map((sizeKey) => {
      const size = sizes[sizeKey];
      return (
        <ToggleButton
          key={sizeKey}
          label={`${size.viewerWidth}x${size.viewerHeight}`}
          sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
          value={sizeKey}
        >
          {`${size.viewerWidth}x${size.viewerHeight}`}
          <EmbedSizeIcon
            width={size.iconWidth}
            height={size.iconHeight}
          />
        </ToggleButton>
      );
    });
  }

  function additionalEmbedParams() {
    const size = sizes[selectedSize];

    if (!(syncIframeDimensions.height || syncIframeDimensions.width)) {
      return '';
    }

    const params = [];

    if (syncIframeDimensions.width) {
      params.push(`${syncIframeDimensions.width.param}=${size.viewerWidth}`);
    }

    if (syncIframeDimensions.height) {
      params.push(`${syncIframeDimensions.height.param}=${size.viewerHeight}`);
    }

    return `&${params.join('&')}`;
  }

  function embedUrl() {
    return `${manifestId.replace(embedUrlReplacePattern[0], embedUrlReplacePattern[1])}${additionalEmbedParams()}`;
  }

  function embedCode() {
    const size = sizes[selectedSize];

    return `<iframe src="${embedUrl()}" title="${embedIframeTitle}" width="${size.viewerWidth}" height="${size.viewerHeight}" ${embedIframeAttributes}></iframe>`;
  }

  return (
    <>
      <SnackbarProvider
        maxSnack={1}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      />
      <Stack sx={{ marginBottom: 1 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">{t('miradorSharePlugin.selectViewerSize')}</FormLabel>
          <ToggleButtonGroup
            exclusive
            value={selectedSize}
            aria-label={t('miradorSharePlugin.ariaSelectViewerSize')}
            name="viewerSize"
            onChange={(e, size) => size && setSelectedSize(size)}
          >
            {formControlLabelsForSizes()}
          </ToggleButtonGroup>
        </FormControl>
        <FormControl component="fieldset">
          <FormLabel htmlFor="copyCode">{t('miradorSharePlugin.copyAndPasteCode')}</FormLabel>
          <Stack direction="row" alignItems="end" gap={1}>
            <TextField
              id="copyCode"
              fullWidth
              multiline
              rows={4}
              value={embedCode()}
              variant="filled"
            />
            <CopyToClipboardButton
              text={embedCode()}
              variant="outlined"
              color="primary"
              aria-label={t('miradorSharePlugin.ariaCopyCodeToClipboard')}
              onClick={() => enqueueSnackbar(
                (
                  <Typography variant="body1">
                    {t('miradorSharePlugin.snackbarCopiedCodeToClipboard')}
                  </Typography>
                ), { variant: 'success' },
              )}
            >
              {t('miradorSharePlugin.buttonCopy')}
            </CopyToClipboardButton>
          </Stack>
        </FormControl>
      </Stack>
    </>
  );
}

MiradorShareEmbed.propTypes = {
  embedIframeAttributes: PropTypes.string.isRequired,
  embedIframeTitle: PropTypes.string.isRequired,
  embedUrlReplacePattern: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(RegExp),
    ]),
  ).isRequired,
  manifestId: PropTypes.string,
  syncIframeDimensions: PropTypes.shape({
    height: PropTypes.shape({ param: PropTypes.string }),
    width: PropTypes.shape({ param: PropTypes.string }),
  }),
};

export default MiradorShareEmbed;
