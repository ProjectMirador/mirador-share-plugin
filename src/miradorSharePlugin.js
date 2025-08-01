import { useCallback } from 'react';
import PropTypes from 'prop-types';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import ShareIcon from '@mui/icons-material/ShareSharp';
// import useTranslation from Mirador instead of react-i18next, see https://github.com/ProjectMirador/mirador/wiki/Creating-a-Mirador-4-Plugin#translations-i18n
import { getManifestoInstance, useTranslation } from 'mirador';
import translations from './translations';

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
  const { t } = useTranslation();
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
        {t('miradorSharePlugin.menuItemShare')}
      </ListItemText>
    </MenuItem>
  );
}

MiradorShare.propTypes = {
  openShareDialog: PropTypes.func,
  handleClose: PropTypes.func,
};

export default {
  target: 'WindowTopBarPluginMenu',
  mode: 'add',
  name: 'MiradorSharePlugin',
  component: MiradorShare,
  config: {
    translations,
  },
  mapDispatchToProps,
  mapStateToProps,
  reducers: {
    windowDialogs: shareDialogReducer,
  },
};
