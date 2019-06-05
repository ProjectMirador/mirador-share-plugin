import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { getManifestoInstance } from 'mirador/dist/es/src/state/selectors/manifests';
import IiiifIcon from './IiifIcon';

const mapDispatchToProps = (dispatch, { windowId }) => ({
  closeShareDialog: () => dispatch({ type: 'CLOSE_WINDOW_DIALOG', windowId }),
});

const mapStateToProps = (state, { windowId }) => ({
  dragAndDropInfoLink: state.config.miradorSharePlugin
    && state.config.miradorSharePlugin.dragAndDropInfoLink,
  manifestId: (getManifestoInstance(state, { windowId }) || {}).id,
  open: (state.windowDialogs[windowId] && state.windowDialogs[windowId].openDialog === 'share'),
});

/**
 * MiradorShareDialog ~
*/
export class MiradorShareDialog extends Component {
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

  /**
   * Returns the rendered component
  */
  render() {
    const { closeShareDialog, open } = this.props;

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
          <Typography variant="h3">Share link</Typography>
          <Divider />
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
  dragAndDropInfoLink: PropTypes.string,
  manifestId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
};

MiradorShareDialog.defaultProps = {
  dragAndDropInfoLink: null,
};

export default {
  target: 'Window',
  mode: 'add',
  component: MiradorShareDialog,
  mapDispatchToProps,
  mapStateToProps,
};
