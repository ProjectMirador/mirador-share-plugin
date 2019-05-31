import React from 'react';
import { shallow } from 'enzyme';
import miradorSharePlugin from '../src';

function createWrapper(props) {
  return shallow(
    <miradorSharePlugin.component
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
      expect(wrapper.find('WithStyles(ListItemText)').props().children).toEqual('Share');
    });
  });

  describe('MenuItem', () => {
    it('udpates the modalDisplayed state which clicked', () => {
      const wrapper = createWrapper();
      expect(wrapper.state().modalDisplayed).toBe(false);
      wrapper.find('WithStyles(MenuItem)').simulate('click');
      expect(wrapper.state().modalDisplayed).toBe(true);
    });
  });

  describe('Dialog', () => {
    it('renders a dialog that is open/closed based on the component state', () => {
      const wrapper = createWrapper();
      expect(wrapper.state().modalDisplayed).toBe(false);
      expect(wrapper.find('WithStyles(Dialog)').props().open).toBe(false);
      wrapper.setState({ modalDisplayed: true });
      expect(wrapper.find('WithStyles(Dialog)').props().open).toBe(true);
    });

    it('renders the section headings in an h3', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('WithStyles(Typography)[variant="h3"]').get(0).props.children).toEqual('Share link');
      expect(wrapper.find('WithStyles(Typography)[variant="h3"]').get(1).props.children).toEqual('Alternate viewer');
      expect(wrapper.find('WithStyles(Typography)[variant="h3"]').get(2).props.children).toEqual('Embed');
    });

    it('has a close button that updates the modalDisplay state to false', () => {
      const wrapper = createWrapper();
      wrapper.setState({ modalDisplayed: true });
      expect(wrapper.state().modalDisplayed).toBe(true);
      wrapper.find('WithStyles(Button)').simulate('click');
      expect(wrapper.state().modalDisplayed).toBe(false);
    });

    it('has dividers', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('WithStyles(Divider)').length).toEqual(3);
    });
  });
});
