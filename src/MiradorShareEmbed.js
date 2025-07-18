import { Component } from 'react';
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

/**
 * MiradorShareEmbed ~
*/
class MiradorShareEmbed extends Component {
  static sizes() {
    return {
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
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedSize: 'small',
    };
    this.handleSizeSelect = this.handleSizeSelect.bind(this);
  }

  handleSizeSelect(e, size) {
    this.setState({
      selectedSize: size,
    });
  }

  formControlLabelsForSizes() { // eslint-disable-line class-methods-use-this
    const sizes = MiradorShareEmbed.sizes();

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

  additionalEmbedParams() {
    const { syncIframeDimensions } = this.props;
    const { selectedSize } = this.state;
    const size = MiradorShareEmbed.sizes()[selectedSize];

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

  embedUrl() {
    const { embedUrlReplacePattern, manifestId } = this.props;

    return `${manifestId.replace(embedUrlReplacePattern[0], embedUrlReplacePattern[1])}${this.additionalEmbedParams()}`;
  }

  embedCode() {
    const { embedIframeAttributes, embedIframeTitle } = this.props;
    const { selectedSize } = this.state;
    const size = MiradorShareEmbed.sizes()[selectedSize];

    return `<iframe src="${this.embedUrl()}" title="${embedIframeTitle}" width="${size.viewerWidth}" height="${size.viewerHeight}" ${embedIframeAttributes}></iframe>`;
  }

  /**
   * Returns the rendered component
  */
  render() {
    const { selectedSize } = this.state;

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
            <FormLabel component="legend">Select viewer size</FormLabel>
            <ToggleButtonGroup
              exclusive
              value={selectedSize}
              aria-label="Select viewer size"
              name="viwerSize"
              onChange={this.handleSizeSelect}
            >
              {this.formControlLabelsForSizes()}
            </ToggleButtonGroup>
          </FormControl>
          <FormControl component="fieldset">
            <FormLabel htmlFor="copyCode">Copy &amp; paste code</FormLabel>
            <Stack direction="row" alignItems="end" gap={1}>
              <TextField
                id="copyCode"
                fullWidth
                multiline
                rows={4}
                value={this.embedCode()}
                variant="filled"
              />
              <CopyToClipboardButton
                text={this.embedCode()}
                variant="outlined"
                color="primary"
                aria-label="Copy code to clipboard"
                onClick={() => enqueueSnackbar(
                  (
                    <Typography variant="body1">
                      Code copied to clipboard!
                    </Typography>
                  ), { variant: 'success' },
                )}
              >
                Copy
              </CopyToClipboardButton>
            </Stack>
          </FormControl>
        </Stack>
      </>
    );
  }
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

MiradorShareEmbed.defaultProps = {
  manifestId: null,
  syncIframeDimensions: {},
};

export default MiradorShareEmbed;
