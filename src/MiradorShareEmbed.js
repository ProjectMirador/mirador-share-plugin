import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import EmbedSizeIcon from './EmbedSizeIcon';

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

  handleSizeSelect(e, value) {
    this.setState({
      selectedSize: value,
    });
  }

  formControlLabelsForSizes() {
    const { classes } = this.props;
    const sizes = MiradorShareEmbed.sizes();
    const iconColor = createMuiTheme().palette.grey[500];
    const icon = (width, height) => (
      <EmbedSizeIcon
        fillColor={iconColor}
        width={width}
        height={height}
      />
    );

    return Object.keys(sizes).map((sizeKey) => {
      const size = sizes[sizeKey];
      return (
        <ToggleButton
          key={sizeKey}
          label={`${size.viewerWidth}x${size.viewerHeight}`}
          value={sizeKey}
          classes={{ label: classes.toggleButtonLabel }}
          className={classes.toggleButton}
        >
          {`${size.viewerWidth}x${size.viewerHeight}`}
          {icon(size.iconWidth, size.iconHeight)}
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

    return `<iframe src="${this.embedUrl()}" title="${embedIframeTitle}" width="${size.viewerWidth}" height="${size.viewerHeight}" ${embedIframeAttributes} />`;
  }

  /**
   * Returns the rendered component
  */
  render() {
    const { classes } = this.props;
    const { selectedSize } = this.state;

    return (
      <React.Fragment>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend" className={classes.legend}>Select viewer size</FormLabel>
          <ToggleButtonGroup
            exclusive
            value={selectedSize}
            onChange={this.handleSizeSelect}
            className={classes.toggleButtonGroup}
          >
            {this.formControlLabelsForSizes()}
          </ToggleButtonGroup>
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend" className={classes.legend}>then copy &amp; paste code</FormLabel>
          <div className={classes.inputContainer}>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={this.embedCode()}
              variant="filled"
            />
            <CopyToClipboard text={this.embedCode()}>
              <Button className={classes.copyButton} variant="outlined" color="primary">Copy</Button>
            </CopyToClipboard>
          </div>
        </FormControl>
      </React.Fragment>
    );
  }
}

MiradorShareEmbed.propTypes = {
  classes: PropTypes.shape({
    copyButton: PropTypes.string,
    formControl: PropTypes.string,
    legend: PropTypes.string,
    inputContainer: PropTypes.string,
    toggleButton: PropTypes.string,
    toggleButtonGroup: PropTypes.string,
    toggleButtonLabel: PropTypes.string,
  }),
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
  classes: {},
  manifestId: null,
  syncIframeDimensions: {},
};

const styles = theme => ({
  copyButton: {
    marginLeft: theme.spacing(),
  },
  formControl: {
    width: '100%',
  },
  legend: {
    paddingBottom: theme.spacing(),
    paddingTop: theme.spacing(),
  },
  inputContainer: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(),
  },
  toggleButton: {
    flexGrow: 1,
  },
  toggleButtonGroup: {
    display: 'flex',
    flexDirection: 'row',
  },
  toggleButtonLabel: {
    flexDirection: 'column',
  },
});

export default withStyles(styles)(MiradorShareEmbed);
