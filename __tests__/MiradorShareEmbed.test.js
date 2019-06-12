import React from 'react';
import { shallow } from 'enzyme';
import MiradorShareEmbed from '../src/MiradorShareEmbed';

/** Utility function to wrap  */
function createWrapper(props) {
  return shallow(
    <MiradorShareEmbed
      embedUrlReplacePattern={[]}
      manifestId="https://example.com/abc123/iiif/manifest"
      windowId="wid123"

      {...props}
    />,
  ).dive();
}

describe('MiradorShareEmbed', () => {
  let wrapper;

  it('renders fieldsets w/ legends for each section of the embed component', () => {
    wrapper = createWrapper();

    expect(wrapper.find('WithStyles(FormControl)[component="fieldset"]').length).toBe(2);
    expect(wrapper.find('WithStyles(WithFormControlContext(FormLabel))[component="legend"]').length).toBe(2);
    expect(wrapper.find(
      'WithStyles(WithFormControlContext(FormLabel))',
    ).at(0).props().children).toEqual('Select viewer size');
    expect(wrapper.find(
      'WithStyles(WithFormControlContext(FormLabel))',
    ).at(1).props().children).toEqual('then copy & paste code');
  });

  it('renders a radio group w/ a form control for each of the size options', () => {
    wrapper = createWrapper();

    expect(wrapper.find('RadioGroup WithStyles(WithFormControlContext(FormControlLabel))').length).toBe(3);
    expect(
      wrapper.find('RadioGroup WithStyles(WithFormControlContext(FormControlLabel))').at(0).props().label,
    ).toEqual('560x420');
    expect(
      wrapper.find('RadioGroup WithStyles(WithFormControlContext(FormControlLabel))').at(1).props().label,
    ).toEqual('640x480');
    expect(
      wrapper.find('RadioGroup WithStyles(WithFormControlContext(FormControlLabel))').at(2).props().label,
    ).toEqual('800x600');
  });

  it('renders the embed code in a text field', () => {
    wrapper = createWrapper();

    expect(wrapper.find('TextField[multiline]').props().value).toMatch(/^<iframe .*/);
  });

  it('has a copy button that uses the CopyToClipboard library', () => {
    wrapper = createWrapper();

    expect(wrapper.find('WithStyles(Button)[children="Copy"]').length).toEqual(1);
    expect(wrapper.find('CopyToClipboard').props().text).toMatch(/^<iframe .*/);
  });

  it('uses the embedUrlReplacePattern prop to generate the embed URL', () => {
    const embedUrlReplacePattern = [
      /.*example\.com\/(\w+)\/iiif\/manifest/,
      'https://embed.example.com/embed?url=https://example.com/$1',
    ];
    wrapper = createWrapper({ embedUrlReplacePattern });

    expect(wrapper.find('TextField[multiline]').props().value).toEqual(
      '<iframe src="https://embed.example.com/embed?url=https://example.com/abc123" width="560" height="420" allowfullscreen frameborder="0" />',
    );
  });

  it('the embed code gets its height and width from state', () => {
    wrapper = createWrapper();

    expect(wrapper.state().selectedSize).toEqual('small');
    expect(wrapper.find('TextField[multiline]').props().value).toMatch(/width="560" height="420"/);
    wrapper.setState({ selectedSize: 'large' });
    expect(wrapper.find('TextField[multiline]').props().value).toMatch(/width="800" height="600"/);
  });

  it('switching the selected radio updates state', () => {
    wrapper = createWrapper();

    expect(wrapper.state().selectedSize).toEqual('small');
    wrapper.find('RadioGroup').simulate('change', { target: { value: 'large' } });
    expect(wrapper.state().selectedSize).toEqual('large');
  });

  describe('Custom Size Option', () => {
    it('renders a custom size button', () => {
      wrapper = createWrapper();

      expect(wrapper.find('RadioGroup WithStyles(Button) WithStyles(Typography)').props().children).toEqual('Custom');
      expect(wrapper.find('RadioGroup WithStyles(Button) TextField[defaultValue="1024"]').length).toEqual(1);
      expect(wrapper.find('RadioGroup WithStyles(Button) TextField[defaultValue="768"]').length).toEqual(1);
    });

    it('sets the size to custom when the Button is clicked', () => {
      wrapper = createWrapper();

      expect(wrapper.state().selectedSize).toEqual('small');
      wrapper.find('RadioGroup WithStyles(Button)').simulate('click');
      expect(wrapper.state().selectedSize).toEqual('custom');
    });

    it('has disabled the text fields unless the Custom option was selected', () => {
      wrapper = createWrapper();

      expect(wrapper.find('RadioGroup WithStyles(Button) TextField[defaultValue="1024"]').props().disabled).toBe(true);
      expect(wrapper.find('RadioGroup WithStyles(Button) TextField[defaultValue="768"]').props().disabled).toBe(true);
      expect(wrapper.setState({ selectedSize: 'custom' }));
    });

    it('properly updates the embed code w/ the custom sizes when custom is selected', () => {
      wrapper = createWrapper();

      expect(wrapper.find('TextField[multiline]').props().value).toMatch(/width="560" height="420"/);
      wrapper.find('RadioGroup WithStyles(Button)').simulate('click');
      expect(wrapper.find('TextField[multiline]').props().value).toMatch(/width="1024" height="768"/);
    });

    it('updates the customSize state when the text fields are updated', () => {
      wrapper = createWrapper();

      wrapper.find('RadioGroup WithStyles(Button)').simulate('click');
      wrapper.find('RadioGroup WithStyles(Button) TextField[defaultValue="1024"]').simulate('change', { target: { value: '900' } });
      expect(wrapper.find('TextField[multiline]').props().value).toMatch(/width="900" height="768"/);
    });
  });
});
