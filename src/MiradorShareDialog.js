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
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getManifestoInstance } from 'mirador/dist/es/src/state/selectors/manifests';
import MiradorShareEmbed from './MiradorShareEmbed';
import IiiifIcon from './IiifIcon';

const mapDispatchToProps = (dispatch, { windowId }) => ({
  closeShareDialog: () => dispatch({ type: 'CLOSE_WINDOW_DIALOG', windowId }),
});

const mapStateToProps = (state, { windowId }) => {
  const miradorSharePluginConfig = state.config.miradorSharePlugin || {};
  return {
    displayEmbedOption: miradorSharePluginConfig.embedOption
      && miradorSharePluginConfig.embedOption.enabled,
    displayShareLink: miradorSharePluginConfig.shareLink
      && miradorSharePluginConfig.shareLink.enabled,
    embedUrlReplacePattern: miradorSharePluginConfig.embedOption
      && miradorSharePluginConfig.embedOption.embedUrlReplacePattern,
    manifestIdReplacePattern: miradorSharePluginConfig.shareLink
      && miradorSharePluginConfig.shareLink.manifestIdReplacePattern,
    dragAndDropInfoLink: miradorSharePluginConfig.dragAndDropInfoLink,
    manifestId: (getManifestoInstance(state, { windowId }) || {}).id,
    open: (state.windowDialogs[windowId] && state.windowDialogs[windowId].openDialog === 'share'),
  };
};

/**
 * MiradorShareDialog ~
*/
export class MiradorShareDialog extends Component {
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

  /**
   * Returns the rendered component
  */
  render() {
    const {
      classes,
      closeShareDialog,
      displayEmbedOption,
      displayShareLink,
      embedUrlReplacePattern,
      manifestId,
      open,
    } = this.props;
    const { shareLinkText } = this.state;

    return (
      <Dialog
        onClose={closeShareDialog}
        open={open}
      >
        <DialogTitle disableTypography>
          <Typography variant="h2">
            Share
          </Typography>
        </DialogTitle>
        <DialogContent>
          {displayShareLink && (
            <React.Fragment>
              <Typography variant="h3">Share link</Typography>
              <TextField
                defaultValue={shareLinkText}
                className={classes.shareLinkTextField}
                margin="dense"
                fullWidth
                variant="filled"
                onChange={e => this.handleShareLinkChange(e && e.target && e.target.value)}
                inputProps={{ 'aria-label': 'Share link URL', className: classes.shareLinkInput }}
              />
              {' '}
              <CopyToClipboard text={shareLinkText}>
                <Button variant="outlined" color="primary">Copy</Button>
              </CopyToClipboard>
              <Divider />
            </React.Fragment>
          )}
          {displayEmbedOption && (
            <React.Fragment>
              <Typography variant="h3">Embed</Typography>
              <MiradorShareEmbed
                embedUrlReplacePattern={embedUrlReplacePattern}
                manifestId={manifestId}
              />
              <Divider />
            </React.Fragment>
          )}
          <Typography variant="h3">Alternate viewer</Typography>
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
    );
  }
}

MiradorShareDialog.propTypes = {
  classes: PropTypes.shape({
    iiifIcon: PropTypes.string,
    iiifLink: PropTypes.string,
    shareLinkInput: PropTypes.string,
    shareLinkTextField: PropTypes.string,
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
};

MiradorShareDialog.defaultProps = {
  displayEmbedOption: false,
  displayShareLink: false,
  dragAndDropInfoLink: null,
  embedUrlReplacePattern: [],
  manifestId: '',
  manifestIdReplacePattern: [],
  open: false,
};

const styles = () => ({
  iiifLink: {
    marginRight: '10px',
  },
  iiifIcon: {
    verticalAlign: 'text-bottom',
  },
  shareLinkInput: {
    paddingTop: '12px',
  },
  shareLinkTextField: {
    paddingRight: 0,
    width: '80%',
  },
});

export default {
  target: 'Window',
  mode: 'add',
  component: withStyles(styles)(MiradorShareDialog),
  mapDispatchToProps,
  mapStateToProps,
};
