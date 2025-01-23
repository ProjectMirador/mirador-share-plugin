import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
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

const StyledCopyButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(),
}));

const StyledInputContainer = styled("div")(({ theme }) => ({
  alignItems: 'flex-end',
  display: 'flex',
  flexDirection: 'row',
  marginBottom: theme.spacing(),
}));

const StyledGrid = styled(Grid)(() => ({
  textAlign: 'center',
  paddingTop: '12px',
}));

const StyledTextField = styled(TextField)(() => ({
  paddingTop: '12px',
}));

const StyledIiifIcon = styled(IiiifIcon)(() => ({
  verticalAlign: 'text-bottom',
  cursor: 'grab',
  paddingTop: '12px',
}));

const StyledLink = styled(Link)(() => ({
  marginRight: '10px',
}));

const StyledTypography = styled(Typography)(() => ({
  marginTop: '20px',
}));


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
      (<Dialog
        container={document.querySelector(`#${containerId} .mirador-viewer`)}
        onClose={closeShareDialog}
        open={open}
      >
        <DialogTitle sx={{  paddingBottom: 0 }}>
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
              <StyledTypography variant="h3">Share link</StyledTypography>
              <StyledInputContainer>
                <StyledTextField
                  defaultValue={shareLinkText}
                  fullWidth
                  variant="filled"
                  onChange={e => this.handleShareLinkChange(e && e.target && e.target.value)}
                  inputProps={{ 'aria-label': 'Share link URL' }}
                />
                {' '}
                <CopyToClipboard text={shareLinkText}>
                  <StyledCopyButton
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
                  </StyledCopyButton>
                </CopyToClipboard>
              </StyledInputContainer>
              <Divider />
            </React.Fragment>
          )}
          {displayEmbedOption && (
            <React.Fragment>
              <StyledTypography variant="h3">Embed</StyledTypography>
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
          <StyledTypography variant="h3">Add to another viewer</StyledTypography>
          <StyledGrid container spacing={1}>
            <Grid item xs>
              <Typography variant="body1">
                Drag & drop IIIF icon to add this resource to any IIIF viewer.
              </Typography>
              <StyledLink href={this.dragAndDropUrl()}>
                <StyledIiifIcon/>
              </StyledLink>
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
          </StyledGrid>
          <Typography variant="body1">{this.whatIsThisLink()}</Typography>
        </ScrollIndicatedDialogContent>
        <DialogActions>
          <Button onClick={closeShareDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>)
    );
  }
}

MiradorShareDialog.propTypes = {
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

export default {
  target: 'Window',
  mode: 'add',
  name: 'MiradorShareDialog',
  component: MiradorShareDialog,
  mapDispatchToProps,
  mapStateToProps,
};
