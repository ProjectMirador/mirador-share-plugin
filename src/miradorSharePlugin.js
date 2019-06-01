import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ShareIcon from '@material-ui/icons/ShareSharp';

class MiradorShare extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalDisplayed: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  handleClick() {
    const { modalDisplayed } = this.state;
    this.setState({ modalDisplayed: !modalDisplayed });
  }

  handleDialogClose() {
    this.setState({ modalDisplayed: false });
  }

  render() {
    const { modalDisplayed } = this.state;
    return (
      <div>
        <MenuItem onClick={this.handleClick}>
          <ShareIcon />
          <ListItemText inset primaryTypographyProps={{ variant: 'body1' }}>
            Share
          </ListItemText>
        </MenuItem>
        <Dialog
          disableEnforceFocus
          onClose={this.handleDialogClose}
          open={modalDisplayed}
          scroll="paper"
        >
          <DialogTitle disableTypography>
            <Typography variant="h2">
              Share
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="h3">Share link</Typography>
            <Divider />
            <Typography variant="h3">Alternate viewer</Typography>
            <Divider />
            <Typography variant="h3">Embed</Typography>
            <Divider />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default {
  target: 'WindowTopMenu',
  mode: 'add',
  component: MiradorShare,
};
