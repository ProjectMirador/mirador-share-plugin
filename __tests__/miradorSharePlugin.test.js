import React from 'react';
import { render, screen } from './utils/test-utils';
import miradorSharePlugin from '../src/miradorSharePlugin';

function createWrapper(props) {
  return render(
    <miradorSharePlugin.component
      handleClose={() => {}}
      openShareDialog={() => {}}
      {...props}
    />,
  );
}

describe('miradorSharePlugin', () => {
  it('has the correct target', () => {
    expect(miradorSharePlugin.target).toBe('WindowTopBarPluginMenu');
  });
  describe('renders a component', () => {
    it('renders a thing', () => {
      createWrapper();
      expect(screen.getByText('Share')).toBeInTheDocument();
    });
  });

  describe('MenuItem', () => {
    it('calls the openShareDialog and handleClose props when clicked', () => {
      const handleClose = jest.fn();
      const openShareDialog = jest.fn();
      createWrapper({ handleClose, openShareDialog });
      screen.getByText('Share').click();
      expect(handleClose).toHaveBeenCalled();
      expect(openShareDialog).toHaveBeenCalled();
    });
  });
});
