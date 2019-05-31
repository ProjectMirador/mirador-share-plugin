import React, { Component } from 'react';

class MiradorShare extends Component {
  render() {
    return (
      <div>
        <h2>Share</h2>
      </div>
    );
  }
}

export default {
  target: 'WindowTopMenu',
  mode: 'add',
  component: MiradorShare,
};
