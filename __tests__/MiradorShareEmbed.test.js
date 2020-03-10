import React from 'react';
import { shallow } from 'enzyme';
import MiradorShareEmbed from '../src/MiradorShareEmbed';

/** Utility function to wrap  */
function createWrapper(props) {
  return shallow(
    <MiradorShareEmbed
      embedIframeTitle="Title Prop"
      embedUrlReplacePattern={[]}
      manifestId="https://example.com/abc123/iiif/manifest"
      {...props}
    />,
  ).dive();
}

describe('MiradorShareEmbed', () => {
  let wrapper;

  it('renders fieldsets w/ legends for each section of the embed component', () => {
    wrapper = createWrapper();

    expect(wrapper.find('WithStyles(ForwardRef(FormControl))[component="fieldset"]').length).toBe(2);
    expect(wrapper.find('WithStyles(ForwardRef(FormLabel))[component="legend"]').length).toBe(2);
    expect(wrapper.find(
      'WithStyles(ForwardRef(FormLabel))',
    ).at(0).props().children).toEqual('Select viewer size');
    expect(wrapper.find(
      'WithStyles(ForwardRef(FormLabel))',
    ).at(1).props().children).toEqual('then copy & paste code');
  });

  it('renders a radio group w/ a form control for each of the size options', () => {
    wrapper = createWrapper();

    expect(wrapper.find('ForwardRef(RadioGroup) WithStyles(ForwardRef(FormControlLabel))').length).toBe(4);
    expect(
      wrapper.find('ForwardRef(RadioGroup) WithStyles(ForwardRef(FormControlLabel))').at(0).props().label,
    ).toEqual('560x420');
    expect(
      wrapper.find('ForwardRef(RadioGroup) WithStyles(ForwardRef(FormControlLabel))').at(1).props().label,
    ).toEqual('640x480');
    expect(
      wrapper.find('ForwardRef(RadioGroup) WithStyles(ForwardRef(FormControlLabel))').at(2).props().label,
    ).toEqual('800x600');
    expect(
      wrapper.find('ForwardRef(RadioGroup) WithStyles(ForwardRef(FormControlLabel))').at(3).props().label,
    ).toEqual('1024x768');
  });

  it('renders the embed code in a text field', () => {
    wrapper = createWrapper();

    expect(wrapper.find('WithStyles(ForwardRef(TextField))').props().value).toMatch(/^<iframe .*/);
  });

  it('has a copy button that uses the CopyToClipboard library', () => {
    wrapper = createWrapper();

    expect(wrapper.find('WithStyles(ForwardRef(Button))').props().children).toEqual('Copy');
    expect(wrapper.find('CopyToClipboard').props().text).toMatch(/^<iframe .*/);
  });

  it('uses the embedUrlReplacePattern prop to generate the embed URL', () => {
    const embedUrlReplacePattern = [
      /.*example\.com\/(\w+)\/iiif\/manifest/,
      'https://embed.example.com/embed?url=https://example.com/$1',
    ];
    wrapper = createWrapper({ embedUrlReplacePattern });

    expect(wrapper.find('WithStyles(ForwardRef(TextField))').props().value).toEqual(
      '<iframe src="https://embed.example.com/embed?url=https://example.com/abc123" title="Title Prop" width="560" height="420" allowfullscreen frameborder="0" />',
    );
  });

  it('renders the iframe title passed in', () => {
    wrapper = createWrapper({ embedIframeTitle: 'A configured title' });

    expect(wrapper.find('WithStyles(ForwardRef(TextField))').props().value).toMatch(/title="A configured title"/);
  });

  it('the embed code gets its height and width from state', () => {
    wrapper = createWrapper();

    expect(wrapper.state().selectedSize).toEqual('small');
    expect(wrapper.find('WithStyles(ForwardRef(TextField))').props().value).toMatch(/width="560" height="420"/);
    wrapper.setState({ selectedSize: 'large' });
    expect(wrapper.find('WithStyles(ForwardRef(TextField))').props().value).toMatch(/width="800" height="600"/);
  });

  it('switching the selected radio updates state', () => {
    wrapper = createWrapper();

    expect(wrapper.state().selectedSize).toEqual('small');
    wrapper.find('ForwardRef(RadioGroup)').simulate('change', { target: { value: 'large' } });
    expect(wrapper.state().selectedSize).toEqual('large');
  });
});
