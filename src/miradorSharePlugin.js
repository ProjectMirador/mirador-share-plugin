import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import ShareIcon from '@mui/icons-material/ShareSharp';
import { getManifestoInstance } from 'mirador';

const shareDialogReducer = (state = {}, action = null) => {
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
  iiifInfoLink: state.config.miradorSharePlugin
    && state.config.miradorSharePlugin.iiifInfoLink,
  manifestId: getManifestoInstance(state, { windowId }).id,
});

function MiradorShare({ handleClose = () => {}, openShareDialog = () => {} }) {
  const openDialogAndClose = useCallback(() => {
    openShareDialog();
    handleClose();
  }, [openShareDialog, handleClose]);

  return (
    <MenuItem onClick={openDialogAndClose}>
      <ListItemIcon>
        <ShareIcon />
      </ListItemIcon>
      <ListItemText primaryTypographyProps={{ variant: 'body1' }}>
        Share
      </ListItemText>
    </MenuItem>
  );
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
