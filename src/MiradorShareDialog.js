import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import copy from 'copy-to-clipboard';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { getManifestoInstance, getContainerId, ScrollIndicatedDialogContent } from 'mirador';
import MiradorShareEmbed from './MiradorShareEmbed';
import IiifIcon from './IiifIcon';

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

const CopyToClipboardButton = ({
  children, onClick, text, ...props
}) => {
  const handleClick = (e) => {
    copy(text);
    onClick(e);
  };

  return (
    <Button
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
};

CopyToClipboardButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

/**
 * MiradorShareDialog ~
*/
export function MiradorShareDialog({
  closeShareDialog,
  containerId,
  displayEmbedOption = false,
  displayShareLink = false,
  embedIframeAttributes = 'allowfullscreen frameborder="0"',
  embedIframeTitle = 'Image viewer',
  embedUrlReplacePattern = [],
  iiifInfoLink = 'https://iiif.io',
  manifestId = '',
  manifestIdReplacePattern = [],
  open = false,
  syncIframeDimensions = {},
}) {
  const [shareLinkText, setShareLinkText] = useState('');
  useEffect(() => {
    if (manifestId) {
      const shareLink = manifestId.replace(manifestIdReplacePattern[0], manifestIdReplacePattern[1]);
      setShareLinkText(shareLink);
    }
    return undefined;
  }, [manifestId, manifestIdReplacePattern, setShareLinkText]);

  if (!open) return null;

  function dragAndDropUrl() {
    const baseUrl = manifestId;
    return `${baseUrl}?manifest=${manifestId}`;
  }

  function whatIsThisLink() {
    if (!iiifInfoLink) return null;

    return (
      <>
        {' '}
        <Link href={iiifInfoLink}>What is IIIF?</Link>
      </>
    );
  }

  return (
    <Dialog
      container={document.querySelector(`#${containerId} .mirador-viewer`)}
      onClose={closeShareDialog}
      open={open}
    >
      <DialogTitle variant="h2" sx={{ paddingBottom: 0 }}>
        Share
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
          <>
            <Typography sx={{ marginTop: 2 }} variant="h3">Share link</Typography>
            <Stack sx={{ marginBottom: 1 }} spacing={1} direction="row">
              <TextField
                defaultValue={shareLinkText}
                fullWidth
                variant="filled"
                onChange={(e) => setShareLinkText(e && e.target && e.target.value)}
                inputProps={{ 'aria-label': 'Share link URL' }}
              />
              {' '}
              <CopyToClipboardButton
                text={shareLinkText}
                variant="outlined"
                color="primary"
                aria-label="Copy link to clipboard"
                onClick={() => enqueueSnackbar(
                  (
                    <Typography variant="body1">
                      Link copied to clipboard!
                    </Typography>
                  ), { variant: 'success' },
                )}
              >
                Copy
              </CopyToClipboardButton>
            </Stack>
            <Divider aria-hidden="true" />
          </>
        )}
        {displayEmbedOption && (
          <>
            <Typography sx={{ marginTop: 2 }} variant="h3">Embed</Typography>
            <MiradorShareEmbed
              embedIframeAttributes={embedIframeAttributes}
              embedIframeTitle={embedIframeTitle}
              embedUrlReplacePattern={embedUrlReplacePattern}
              syncIframeDimensions={syncIframeDimensions}
              manifestId={manifestId}
            />
            <Divider aria-hidden="true" />
          </>
        )}
        <Typography sx={{ marginTop: 2 }} variant="h3">Add to another viewer</Typography>
        <Grid container spacing={1} sx={{ textAlign: 'center' }}>
          <Grid
            container
            spacing={2}
            sx={{ display: 'grid', gap: 1, margin: 0 }}
            size="grow"
          >
            <Typography align="center" variant="body1">
              Drag & drop IIIF icon to add this resource to any IIIF viewer.
            </Typography>
            <Link href={dragAndDropUrl()} aria-label="Drag icon to any IIIF viewer.">
              <IiifIcon sx={{ cursor: 'grab' }} />
            </Link>
          </Grid>
          <Grid size={1}>
            <Typography variant="body1">or</Typography>
          </Grid>
          <Grid justifyContent="center" size="grow">
            <Typography align="center" variant="body1">
              Copy & paste the resource&apos;s manifest into any IIIF viewer.
            </Typography>
            {' '}
            <CopyToClipboardButton
              text={dragAndDropUrl()}
              variant="outlined"
              color="primary"
              aria-label="Copy manifest to clipboard"
              onClick={() => enqueueSnackbar(
                (
                  <Typography variant="body1">
                    Manifest copied to clipboard!
                  </Typography>
                ), { variant: 'success' },
              )}
            >
              Copy
            </CopyToClipboardButton>
          </Grid>
        </Grid>
        <Typography variant="body1">{whatIsThisLink()}</Typography>
      </ScrollIndicatedDialogContent>
      <DialogActions>
        <Button onClick={closeShareDialog} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
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

export default {
  target: 'Window',
  mode: 'add',
  name: 'MiradorShareDialog',
  component: MiradorShareDialog,
  mapDispatchToProps,
  mapStateToProps,
};
