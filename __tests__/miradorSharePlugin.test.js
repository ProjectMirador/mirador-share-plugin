import React from 'react';
import { shallow } from 'enzyme';
import miradorSharePlugin from '../src/miradorSharePlugin';

function createWrapper(props) {
  return shallow(
    <miradorSharePlugin.component
      handleClose={() => {}}
      openShareDialog={() => {}}

      {...props}
    />,
  );
}

describe('miradorSharePlugin', () => {
  it('has the correct target', () => {
    expect(miradorSharePlugin.target).toBe('WindowTopMenu');
  });
  describe('renders a component', () => {
    it('renders a thing', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('WithStyles(ForwardRef(ListItemText))').props().children).toEqual('Share');
    });
  });

  describe('MenuItem', () => {
    it('calls the openShareDialog and handleClose props when clicked', () => {
      const handleClose = jest.fn();
      const openShareDialog = jest.fn();
      const wrapper = createWrapper({ handleClose, openShareDialog });
      wrapper.find('WithStyles(ForwardRef(MenuItem))').simulate('click');
      expect(handleClose).toHaveBeenCalled();
      expect(openShareDialog).toHaveBeenCalled();
    });
  });
});
