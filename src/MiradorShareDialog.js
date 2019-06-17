import React, { Component } from 'react';
import { getManifestoInstance } from 'mirador/dist/es/src/state/selectors/manifests';
import MiradorShareDialogContent from './MiradorShareDialogContent';

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
  /**
   * Returns the rendered component
  */
  render() {
    return (
      <MiradorShareDialogContent {...this.props} />
    );
  }
}

export default {
  target: 'Window',
  mode: 'add',
  name: 'MiradorShareDialog',
  component: MiradorShareDialog,
  mapDispatchToProps,
  mapStateToProps,
};
