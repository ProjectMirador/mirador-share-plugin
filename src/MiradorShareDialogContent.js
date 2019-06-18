import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import MiradorShareEmbed from './MiradorShareEmbed';
import IiiifIcon from './IiifIcon';

class MiradorShareDialogContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shareLinkText: this.shareLink(),
    };

    this.handleShareLinkChange = this.handleShareLinkChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { manifestId } = this.props;
    if (manifestId !== prevProps.manifestId) {
      this.handleShareLinkChange(this.shareLink());
    }
  }

  dragAndDropUrl() {
    const { dragAndDropInfoLink, manifestId } = this.props;
    let baseUrl;

    baseUrl = manifestId;

    if (dragAndDropInfoLink) {
      baseUrl = dragAndDropInfoLink;
    }

    return `${baseUrl}?manifest=${manifestId}`;
  }

  whatIsThisLink() {
    const { dragAndDropInfoLink } = this.props;

    if (!dragAndDropInfoLink) return null;

    return (
      <React.Fragment>
        {' '}
        [
        <Link href={dragAndDropInfoLink}>What is IIIF?</Link>
        ]
      </React.Fragment>
    );
  }

  shareLink() {
    const { manifestId, manifestIdReplacePattern } = this.props;
    if (!manifestId) return null;

    return manifestId.replace(manifestIdReplacePattern[0], manifestIdReplacePattern[1]);
  }

  handleShareLinkChange(value) {
    this.setState({
      shareLinkText: value,
    });
  }

  render() {
    const {
      classes,
      closeShareDialog,
      displayEmbedOption,
      displayShareLink,
      embedUrlReplacePattern,
      manifestId,
      open,
      theme,
    } = this.props;
    const { shareLinkText } = this.state;

    return (
      <MuiThemeProvider theme={createMuiTheme(theme)}>
        <Dialog
          onClose={closeShareDialog}
          open={open}
        >
          <DialogTitle disableTypography className={classes.h2}>
            <Typography variant="h2">
              Share
            </Typography>
          </DialogTitle>
          <DialogContent>
            {displayShareLink && (
              <React.Fragment>
                <Typography className={classes.h3} variant="h3">Share link</Typography>
                <div className={classes.inputContainer}>
                  <TextField
                    defaultValue={shareLinkText}
                    fullWidth
                    variant="filled"
                    onChange={e => this.handleShareLinkChange(e && e.target && e.target.value)}
                    inputProps={{ 'aria-label': 'Share link URL', className: classes.shareLinkInput }}
                  />
                  {' '}
                  <CopyToClipboard text={shareLinkText}>
                    <Button className={classes.copyButton} variant="outlined" color="primary">Copy</Button>
                  </CopyToClipboard>
                </div>
                <Divider />
              </React.Fragment>
            )}
            {displayEmbedOption && (
              <React.Fragment>
                <Typography className={classes.h3} variant="h3">Embed</Typography>
                <MiradorShareEmbed
                  embedUrlReplacePattern={embedUrlReplacePattern}
                  manifestId={manifestId}
                />
                <Divider />
              </React.Fragment>
            )}
            <Typography className={classes.h3} variant="h3">Alternate viewer</Typography>
            <Typography variant="body1">
              <Link href={this.dragAndDropUrl()} className={classes.iiifLink}>
                <IiiifIcon className={classes.iiifIcon} />
              </Link>
              Drag & drop this icon to any IIIF viewer.
              {this.whatIsThisLink()}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeShareDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

MiradorShareDialogContent.propTypes = {
  classes: PropTypes.shape({
    copyButton: PropTypes.string,
    h2: PropTypes.string,
    h3: PropTypes.string,
    iiifIcon: PropTypes.string,
    iiifLink: PropTypes.string,
    inputContainer: PropTypes.string,
    shareLinkInput: PropTypes.string,
  }).isRequired,
  closeShareDialog: PropTypes.func.isRequired,
  displayEmbedOption: PropTypes.bool,
  displayShareLink: PropTypes.bool,
  dragAndDropInfoLink: PropTypes.string,
  embedUrlReplacePattern: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(RegExp),
    ]),
  ),
  manifestIdReplacePattern: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(RegExp),
    ]),
  ),
  manifestId: PropTypes.string,
  open: PropTypes.bool,
  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

MiradorShareDialogContent.defaultProps = {
  displayEmbedOption: false,
  displayShareLink: false,
  dragAndDropInfoLink: null,
  embedUrlReplacePattern: [],
  manifestId: '',
  manifestIdReplacePattern: [],
  open: false,
};

const styles = theme => ({
  copyButton: {
    marginLeft: theme.spacing(),
  },
  h2: {
    paddingBottom: 0,
  },
  h3: {
    marginTop: '20px',
  },
  iiifLink: {
    marginRight: '10px',
  },
  iiifIcon: {
    verticalAlign: 'text-bottom',
  },
  inputContainer: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(),
  },
  shareLinkInput: {
    paddingTop: '12px',
  },
});

export default withStyles(styles)(MiradorShareDialogContent);
