import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
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
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      customSize: { width: 1024, height: 768 },
      selectedSize: 'small',
    };
  }

  handleSizeSelect(size) {
    if (Object.keys(MiradorShareEmbed.sizes()).includes(size)) {
      this.setState({
        selectedSize: size,
      });
      return;
    }

    this.setState({
      selectedSize: 'custom',
    });
  }

  handleCustomSizeUpdate(value, type) {
    const { customSize } = this.state;

    this.setState({
      customSize: { ...customSize, [type]: value },
    });
  }

  formControlLabelsForSizes() {
    const { classes } = this.props;
    const { selectedSize } = this.state;
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
        <FormControlLabel
          className={[
            classes.formControlLabel,
            (selectedSize === sizeKey ? classes.selectedSize : ''),
          ].join(' ')
          }
          control={(
            <Radio
              checkedIcon={icon(size.iconWidth, size.iconHeight)}
              icon={icon(size.iconWidth, size.iconHeight)}
            />
          )}
          key={sizeKey}
          label={`${size.viewerWidth}x${size.viewerHeight}`}
          labelPlacement="top"
          value={sizeKey}
        />
      );
    });
  }

  customEmbedOption() {
    const { classes, windowId } = this.props;
    const { selectedSize } = this.state;

    return (
      <Button
        classes={{ label: classes.buttonLabel }}
        className={[classes.customControl, (selectedSize === 'custom' && classes.selectedSize)].join(' ')}
        onClick={() => { this.handleSizeSelect('custom'); }}
      >
        <Typography variant="body1">Custom</Typography>
        <div className={classes.customInputContainer}>
          <InputLabel className={classes.customLabel} htmlFor={`${windowId}-embed-width-input`}>Width</InputLabel>
          {' '}
          <TextField
            className={classes.customInput}
            defaultValue="1024"
            disabled={selectedSize !== 'custom'}
            id={`${windowId}-embed-width-input`}
            onChange={(e) => { this.handleCustomSizeUpdate(e.target.value, 'width'); }}
          />
          {' '}
          px
        </div>
        <div className={classes.customInputContainer}>
          <InputLabel className={classes.customLabel} htmlFor={`${windowId}-embed-height-input`}>Height</InputLabel>
          {' '}
          <TextField
            className={classes.customInput}
            defaultValue="768"
            disabled={selectedSize !== 'custom'}
            id={`${windowId}-embed-height-input`}
            onChange={(e) => { this.handleCustomSizeUpdate(e.target.value, 'height'); }}
          />
          {' '}
          px
        </div>
      </Button>
    );
  }

  embedUrl() {
    const { embedUrlReplacePattern, manifestId } = this.props;

    return manifestId.replace(embedUrlReplacePattern[0], embedUrlReplacePattern[1]);
  }

  embedCode() {
    const { customSize, selectedSize } = this.state;
    let size;

    if (selectedSize === 'custom') {
      size = { viewerWidth: customSize.width, viewerHeight: customSize.height };
    } else {
      size = MiradorShareEmbed.sizes()[selectedSize];
    }

    return `<iframe src="${this.embedUrl()}" width="${size.viewerWidth}" height="${size.viewerHeight}" allowfullscreen frameborder="0" />`;
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
          <RadioGroup
            aria-label="Select viewer size"
            className={classes.radioGroup}
            name="viwerSize"
            value={selectedSize}
            onChange={(e) => { this.handleSizeSelect(e.target.value); }}
          >
            {this.formControlLabelsForSizes()}
            {this.customEmbedOption()}
          </RadioGroup>
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend" className={classes.legend}>then copy &amp; paste code</FormLabel>
          <TextField
            multiline
            rows={4}
            value={this.embedCode()}
            variant="filled"
          />
          <CopyToClipboard text={this.embedCode()}>
            <Button variant="outlined" color="primary">Copy</Button>
          </CopyToClipboard>
        </FormControl>
      </React.Fragment>
    );
  }
}

MiradorShareEmbed.propTypes = {
  classes: PropTypes.shape({
    buttonLabel: PropTypes.string,
    customControl: PropTypes.string,
    customInput: PropTypes.string,
    customInputContainer: PropTypes.string,
    customLabel: PropTypes.string,
    formControl: PropTypes.string,
    formControlLabel: PropTypes.string,
    legend: PropTypes.string,
    radioGroup: PropTypes.string,
    selectedSize: PropTypes.string,
  }),
  embedUrlReplacePattern: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(RegExp),
    ]),
  ).isRequired,
  manifestId: PropTypes.string,
  windowId: PropTypes.string.isRequired,
};

MiradorShareEmbed.defaultProps = {
  classes: {},
  manifestId: null,
};

const styles = theme => ({
  buttonLabel: {
    display: 'inline',
    textTransform: 'none',
  },
  customControl: {
    alignItems: 'center',
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 0,
    display: 'inline-flex',
    flexDirection: 'column',
    flexGrow: 5,
    height: '117px',
    verticalAlign: 'middle',
  },
  customLabel: {
    position: 'relative',
  },
  customInput: {
    width: '45px',
  },
  customInputContainer: {
    textAlign: 'right',
  },
  formControl: {
    width: '100%',
  },
  formControlLabel: {
    border: `1px solid ${theme.palette.grey[500]}`,
    flexGrow: 1,
    height: '115px',
    margin: '0',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  legend: {
    paddingBottom: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
  },
  radioGroup: {
    flexDirection: 'row',
  },
  selectedSize: {
    backgroundColor: theme.palette.action.selected,
  },
});

export default withStyles(styles)(MiradorShareEmbed);
