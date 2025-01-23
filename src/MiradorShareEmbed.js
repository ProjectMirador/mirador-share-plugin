import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createTheme from '@mui/material/styles/createTheme';
import styled from '@mui/material/styles/styled';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import EmbedSizeIcon from './EmbedSizeIcon';

const StyledCopyButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(),
}));

const StyledFormControl = styled(FormControl)(() => ({
  width: '100%',
}));

const StyledFormControlLabel = styled(FormControlLabel, {
  shouldForwardProp: (prop) => prop !== 'selected',
})(({ theme, selected }) => ({
  border: `1px solid ${theme.palette.grey[500]}`,
  height: '125px',
  flexGrow: 1,
  margin: '0',
  backgroundColor: selected ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  transition: 'background-color 0.3s ease',
}));

const StyledLegend = styled(FormLabel)(({ theme }) => ({
  paddingBottom: theme.spacing(),
  paddingTop: theme.spacing(),
}));

const StyledLabel = styled(FormLabel)(({ theme }) => ({
  paddingBottom: theme.spacing(),
  paddingTop: theme.spacing(),
}));

const StyledRadioGroup = styled(RadioGroup)(() => ({
  display: 'flex',
  flexDirection: 'row',
}));

const StyledInputContainer = styled('div')(({ theme }) => ({
  alignItems: 'flex-end',
  display: 'flex',
  flexDirection: 'row',
  marginBottom: theme.spacing(),
}));

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
  }

  handleSizeSelect(size) {
    this.setState({
      selectedSize: size,
    });
  }

  formControlLabelsForSizes() {
    const { selectedSize } = this.state;
    const sizes = MiradorShareEmbed.sizes();
    const iconColor = createTheme().palette.grey[500];
    const icon = (width, height) => (
      <EmbedSizeIcon fillColor={iconColor} width={width} height={height} />
    );

    return Object.keys(sizes).map((sizeKey) => {
      const size = sizes[sizeKey];
      return (
        <StyledFormControlLabel
          selected={selectedSize === sizeKey}
          control={
            <Radio
              checkedIcon={icon(size.iconWidth, size.iconHeight)}
              icon={icon(size.iconWidth, size.iconHeight)}
            />
          }
          key={sizeKey}
          label={`${size.viewerWidth}x${size.viewerHeight}`}
          labelPlacement="top"
          value={sizeKey}
        />
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
    return (
      <React.Fragment>
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        />
        <StyledFormControl component="fieldset">
          <StyledLegend component="legend">Select viewer size</StyledLegend>
          <StyledRadioGroup
            aria-label="Select viewer size"
            name="viwerSize"
            onChange={(e) => {
              this.handleSizeSelect(e.target.value);
            }}
          >
            {this.formControlLabelsForSizes()}
          </StyledRadioGroup>
        </StyledFormControl>
        <StyledFormControl component="fieldset">
          <StyledLabel for="copyCode">Copy &amp; paste code</StyledLabel>
          <StyledInputContainer>
            <TextField
              id="copyCode"
              fullWidth
              multiline
              rows={4}
              value={this.embedCode()}
              variant="filled"
            />
            <CopyToClipboard text={this.embedCode()}>
              <StyledCopyButton
                variant="outlined"
                color="primary"
                aria-label="Copy code to clipboard"
                onClick={() =>
                  enqueueSnackbar(
                    <Typography variant="body1">Code copied to clipboard!</Typography>,
                    { variant: 'success' },
                  )
                }
              >
                Copy
              </StyledCopyButton>
            </CopyToClipboard>
          </StyledInputContainer>
        </StyledFormControl>
      </React.Fragment>
    );
  }
}

MiradorShareEmbed.propTypes = {
  embedIframeAttributes: PropTypes.string.isRequired,
  embedIframeTitle: PropTypes.string.isRequired,
  embedUrlReplacePattern: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)]),
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
