import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import IiiifIcon from './IiifIcon';

const mapDispatchToProps = (dispatch, { windowId }) => ({
  closeShareDialog: () => dispatch({ type: 'CLOSE_WINDOW_DIALOG', windowId }),
});

const mapStateToProps = (state, { windowId }) => {
  const miradorSharePluginConfig = state.config.miradorSharePlugin || {};
  return {
    displayShareLink: miradorSharePluginConfig.shareLink
      && miradorSharePluginConfig.shareLink.enabled,
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
        <Link href={dragAndDropInfoLink} disableTypography>What is IIIF?</Link>
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
    const { closeShareDialog, displayShareLink, open } = this.props;
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
                margin="dense"
                fullWidth
                style={{ paddingRight: 0, width: '80%' }}
                variant="filled"
                onChange={e => this.handleShareLinkChange(e && e.target && e.target.value)}
                inputProps={{ 'aria-label': 'Share link URL', style: { paddingTop: '12px' } }}
              />
              {' '}
              <CopyToClipboard text={shareLinkText}>
                <Button variant="outlined" color="primary">Copy</Button>
              </CopyToClipboard>
              <Divider />
            </React.Fragment>
          )}
          <Typography variant="h3">Embed</Typography>
          <Divider />
          <Typography variant="h3">Alternate viewer</Typography>
          <Typography variant="body1">
            <Link href={this.dragAndDropUrl()} disableTypography>
              <IiiifIcon style={{ marginRight: '10px' }} />
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
  closeShareDialog: PropTypes.func.isRequired,
  displayShareLink: PropTypes.bool,
  dragAndDropInfoLink: PropTypes.string,
  manifestIdReplacePattern: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(RegExp),
    ]),
  ),
  manifestId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
};

MiradorShareDialog.defaultProps = {
  displayShareLink: false,
  dragAndDropInfoLink: null,
  manifestIdReplacePattern: [],
};

export default {
  target: 'Window',
  mode: 'add',
  component: MiradorShareDialog,
  mapDispatchToProps,
  mapStateToProps,
};
