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
      expect(wrapper.find('h2').text()).toEqual('Share');
    });
  });
});
