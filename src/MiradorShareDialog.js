import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { getManifestoInstance } from 'mirador/dist/es/src/state/selectors/manifests';
import { getContainerId } from 'mirador/dist/es/src/state/selectors/config';
import ScrollIndicatedDialogContent from 'mirador/dist/es/src/containers/ScrollIndicatedDialogContent';
import MiradorShareEmbed from './MiradorShareEmbed';
import IiiifIcon from './IiifIcon';

const mapDispatchToProps = (dispatch, { windowId }) => ({
  closeShareDialog: () => dispatch({ type: 'CLOSE_WINDOW_DIALOG', windowId }),
});

const mapStateToProps = (state, { windowId }) => {
  const miradorSharePluginConfig = state.config.miradorSharePlugin || {};
  const embedOption = miradorSharePluginConfig.embedOption || {};

  return {
    containerId: getContainerId(state),
    displayEmbedOption: embedOption.enabled,
    displayShareLink: miradorSharePluginConfig.shareLink
      && miradorSharePluginConfig.shareLink.enabled,
    embedUrlReplacePattern: embedOption.embedUrlReplacePattern,
    embedIframeAttributes: embedOption.embedIframeAttributes,
    embedIframeTitle: embedOption.embedIframeTitle,
    manifestIdReplacePattern: miradorSharePluginConfig.shareLink
      && miradorSharePluginConfig.shareLink.manifestIdReplacePattern,
    iiifInfoLink: miradorSharePluginConfig.iiifInfoLink,
    manifestId: (getManifestoInstance(state, { windowId }) || {}).id,
    open: (state.windowDialogs[windowId] && state.windowDialogs[windowId].openDialog === 'share'),
    syncIframeDimensions: embedOption.syncIframeDimensions,
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
    const { manifestId } = this.props;
    const baseUrl = manifestId;

    return `${baseUrl}?manifest=${manifestId}`;
  }

  whatIsThisLink() {
    const { iiifInfoLink } = this.props;

    if (!iiifInfoLink) return null;

    return (
      <React.Fragment>
        {' '}
        <Link href={iiifInfoLink}>What is IIIF?</Link>
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
      containerId,
      displayEmbedOption,
      displayShareLink,
      embedIframeAttributes,
      embedIframeTitle,
      embedUrlReplacePattern,
      manifestId,
      open,
      syncIframeDimensions,
    } = this.props;
    const { shareLinkText } = this.state;

    if (!open) return (<React.Fragment />);

    return (
      <Dialog
        container={document.querySelector(`#${containerId} .mirador-viewer`)}
        onClose={closeShareDialog}
        open={open}
      >
        <DialogTitle disableTypography className={classes.h2}>
          <Typography variant="h2">
            Share
          </Typography>
        </DialogTitle>
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        />
        <ScrollIndicatedDialogContent>
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
                  <Button
                    className={classes.copyButton}
                    variant="outlined"
                    color="primary"
                    aria-label="Copy link to clipboard"
                    onClick={() => enqueueSnackbar((
                      <Typography variant="body1">
                        Link copied to clipboard!
                      </Typography>
                    ), { variant: 'success' })}
                  >
                    Copy
                  </Button>
                </CopyToClipboard>
              </div>
              <Divider />
            </React.Fragment>
          )}
          {displayEmbedOption && (
            <React.Fragment>
              <Typography className={classes.h3} variant="h3">Embed</Typography>
              <MiradorShareEmbed
                embedIframeAttributes={embedIframeAttributes}
                embedIframeTitle={embedIframeTitle}
                embedUrlReplacePattern={embedUrlReplacePattern}
                syncIframeDimensions={syncIframeDimensions}
                manifestId={manifestId}
              />
              <Divider />
            </React.Fragment>
          )}
          <Typography className={classes.h3} variant="h3">Add to another viewer</Typography>
          <Grid container spacing={1} className={classes.grid}>
            <Grid item xs>
              <Typography variant="body1">
                Drag & drop IIIF icon to add this resource to any IIIF viewer.
              </Typography>
              <Link href={this.dragAndDropUrl()} className={classes.iiifLink}>
                <IiiifIcon className={classes.iiifIcon} />
              </Link>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body1">or</Typography>
            </Grid>
            <Grid item xs>
              <Typography variant="body1">
                Copy & paste the resource&apos;s manifest into any IIIF viewer.
              </Typography>
              <CopyToClipboard text={this.dragAndDropUrl()}>
                <Button
                  className={classes.copyButton}
                  variant="outlined"
                  color="primary"
                  aria-label="Copy manifest to clipboard"
                  onClick={() => enqueueSnackbar((
                    <Typography variant="body1">
                      Manifest copied to clipboard!
                    </Typography>
                  ), { variant: 'success' })}
                >
                  Copy
                </Button>
              </CopyToClipboard>
            </Grid>
          </Grid>
          <Typography variant="body1">{this.whatIsThisLink()}</Typography>
        </ScrollIndicatedDialogContent>
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
    copyButton: PropTypes.string,
    h2: PropTypes.string,
    h3: PropTypes.string,
    iiifIcon: PropTypes.string,
    iiifLink: PropTypes.string,
    inputContainer: PropTypes.string,
    shareLinkInput: PropTypes.string,
    grid: PropTypes.string,
  }).isRequired,
  closeShareDialog: PropTypes.func.isRequired,
  containerId: PropTypes.string.isRequired,
  displayEmbedOption: PropTypes.bool,
  displayShareLink: PropTypes.bool,
  iiifInfoLink: PropTypes.string,
  embedIframeAttributes: PropTypes.string,
  embedIframeTitle: PropTypes.string,
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
  syncIframeDimensions: PropTypes.shape({
    height: PropTypes.shape({ param: PropTypes.string }),
    width: PropTypes.shape({ param: PropTypes.string }),
  }),
};

MiradorShareDialog.defaultProps = {
  displayEmbedOption: false,
  displayShareLink: false,
  iiifInfoLink: 'https://iiif.io',
  embedIframeAttributes: 'allowfullscreen frameborder="0"',
  embedIframeTitle: 'Image viewer',
  embedUrlReplacePattern: [],
  manifestId: '',
  manifestIdReplacePattern: [],
  open: false,
  syncIframeDimensions: {},
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
    cursor: 'grab',
    paddingTop: '12px',
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
  grid: {
    textAlign: 'center',
    paddingTop: '12px',
  },
});

export default {
  target: 'Window',
  mode: 'add',
  name: 'MiradorShareDialog',
  component: withStyles(styles)(MiradorShareDialog),
  mapDispatchToProps,
  mapStateToProps,
};
