import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import ShareIcon from '@material-ui/icons/ShareSharp';
import { getManifestoInstance } from 'mirador/dist/es/src/state/selectors/manifests';

const shareDialogReducer = (state = {}, action) => {
  if (action.type === 'OPEN_WINDOW_DIALOG') {
    return {
      ...state,
      [action.windowId]: {
        openDialog: action.dialogType,
      },
    };
  }

  if (action.type === 'CLOSE_WINDOW_DIALOG') {
    return {
      ...state,
      [action.windowId]: {
        openDialog: null,
      },
    };
  }
  return state;
};

const mapDispatchToProps = (dispatch, { windowId }) => ({
  openShareDialog: () => dispatch({ type: 'OPEN_WINDOW_DIALOG', windowId, dialogType: 'share' }),
});

const mapStateToProps = (state, { windowId }) => ({
  dragAndDropInfoLink: state.config.miradorSharePlugin
    && state.config.miradorSharePlugin.dragAndDropInfoLink,
  manifestId: getManifestoInstance(state, { windowId }).id,
});

class MiradorShare extends Component {
  openDialogAndClose() {
    const { openShareDialog, handleClose } = this.props;

    openShareDialog();
    handleClose();
  }

  render() {
    const { openShareDialog, handleClose, ...menuProps } = this.props;
    return (
      <MenuItem {...menuProps} onClick={() => this.openDialogAndClose()}>
        <ListItemIcon>
          <ShareIcon />
        </ListItemIcon>
        <ListItemText primaryTypographyProps={{ variant: 'body1' }}>
          Share
        </ListItemText>
      </MenuItem>
    );
  }
}

MiradorShare.propTypes = {
  openShareDialog: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default {
  target: 'WindowTopBarPluginMenu',
  mode: 'add',
  name: 'MiradorSharePlugin',
  component: MiradorShare,
  mapDispatchToProps,
  mapStateToProps,
  reducers: {
    windowDialogs: shareDialogReducer,
  },
};
