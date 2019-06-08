import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
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
      selectedSize: 'small',
    };
  }

  handleSizeSelect(size) {
    this.setState({
      selectedSize: size,
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
            (selectedSize === sizeKey ? classes.selectedFormControlLabel : ''),
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

  embedUrl() {
    const { embedUrlReplacePattern, manifestId } = this.props;

    return manifestId.replace(embedUrlReplacePattern[0], embedUrlReplacePattern[1]);
  }

  embedCode() {
    const { selectedSize } = this.state;
    const size = MiradorShareEmbed.sizes()[selectedSize];

    return `<iframe src="${this.embedUrl()}" width="${size.viewerWidth}" height="${size.viewerHeight}" allowfullscreen frameborder="0" />`;
  }

  /**
   * Returns the rendered component
  */
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Select viewer size</FormLabel>
          <RadioGroup
            aria-label="Select viewer size"
            className={classes.radioGroup}
            name="viwerSize"
            onChange={(e) => { this.handleSizeSelect(e.target.value); }}
          >
            {this.formControlLabelsForSizes()}
          </RadioGroup>
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">then copy &amp; paste code</FormLabel>
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
    formControl: PropTypes.string,
    formControlLabel: PropTypes.string,
    radioGroup: PropTypes.string,
    selectedFormControlLabel: PropTypes.string,
  }),
  embedUrlReplacePattern: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(RegExp),
    ]),
  ).isRequired,
  manifestId: PropTypes.string,
};

MiradorShareEmbed.defaultProps = {
  classes: {},
  manifestId: null,
};

const styles = theme => ({
  formControl: {
    width: '100%',
  },
  formControlLabel: {
    border: `1px solid ${theme.palette.grey[500]}`,
    height: '115px',
    margin: '0',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  radioGroup: {
    display: 'inline',
  },
  selectedFormControlLabel: {
    backgroundColor: theme.palette.action.selected,
  },
});

export default withStyles(styles)(MiradorShareEmbed);
