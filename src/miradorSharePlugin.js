import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import ShareIcon from '@mui/icons-material/ShareSharp';
import { getManifestoInstance } from 'mirador';

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
  iiifInfoLink: state.config.miradorSharePlugin && state.config.miradorSharePlugin.iiifInfoLink,
  manifestId: getManifestoInstance(state, { windowId }).id,
});

const MiradorShare = ({ openShareDialog, handleClose, ...menuProps }) => {
  const openDialogAndClose = () => {
    openShareDialog();
    handleClose();
  };

  return (
    <MenuItem {...menuProps} onClick={openDialogAndClose}>
      <ListItemIcon>
        <ShareIcon />
      </ListItemIcon>
      <ListItemText primaryTypographyProps={{ variant: 'body1' }}>Share</ListItemText>
    </MenuItem>
  );
};

MiradorShare.propTypes = {
  handleClose: PropTypes.func.isRequired,
  openShareDialog: PropTypes.func.isRequired,
};

export default {
  component: MiradorShare,
  mapDispatchToProps,
  mapStateToProps,
  mode: 'add',
  name: 'MiradorSharePlugin',
  reducers: {
    windowDialogs: shareDialogReducer,
  },
  target: 'WindowTopBarPluginMenu',

};
