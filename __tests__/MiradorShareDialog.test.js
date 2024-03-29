import React from 'react';
import { shallow } from 'enzyme';
import miradorShareDialog from '../src/MiradorShareDialog';

function createWrapper(props) {
  return shallow(
    <miradorShareDialog.component
      closeShareDialog={() => {}}
      containerId="container-123"
      displayEmbedOption
      displayShareLink
      manifestId="http://example.com/abc/iiif/manifest"
      open
      {...props}
    />,
  ).dive();
}

describe('Dialog', () => {
  let wrapper;
  it('renders a dialog based on the passed in open prop', () => {
    wrapper = createWrapper();
    expect(wrapper.find('WithStyles(ForwardRef(Dialog))').props().open).toBe(true);
    wrapper = createWrapper({ open: false });
    expect(wrapper.find('WithStyles(ForwardRef(Dialog))').length).toBe(0);
  });

  it('renders the section headings in an h3', () => {
    wrapper = createWrapper();
    expect(wrapper.find('WithStyles(ForwardRef(Typography))[variant="h3"]').get(0).props.children).toEqual('Share link');
    expect(wrapper.find('WithStyles(ForwardRef(Typography))[variant="h3"]').get(1).props.children).toEqual('Embed');
    expect(wrapper.find('WithStyles(ForwardRef(Typography))[variant="h3"]').get(2).props.children).toEqual('Add to another viewer');
  });

  it('has a close button that calls closeShareDialog on click', () => {
    const closeShareDialog = jest.fn();
    wrapper = createWrapper({ closeShareDialog });
    wrapper.find('WithStyles(ForwardRef(DialogActions)) WithStyles(ForwardRef(Button))').simulate('click');
    expect(closeShareDialog).toHaveBeenCalled();
  });

  it('has dividers', () => {
    wrapper = createWrapper();
    expect(wrapper.find('WithStyles(ForwardRef(Divider))').length).toEqual(2);
  });

  describe('Share link section', () => {
    it('renders the section w/ a TextField and a Copy Button', () => {
      wrapper = createWrapper();

      expect(wrapper.find('WithStyles(ForwardRef(TextField))').length).toBe(1);
      expect(wrapper.find('CopyToClipboard WithStyles(ForwardRef(Button))').get(0).props.children).toEqual('Copy');
    });

    it('renders the TextField & CopyToClipboard components w/ the shareLinkText state value', () => {
      wrapper = createWrapper();

      wrapper.setState({ shareLinkText: 'http://example.com/iiif/manifest' });
      expect(wrapper.find('WithStyles(ForwardRef(TextField))').props().defaultValue).toEqual('http://example.com/iiif/manifest');
      expect(wrapper.find('CopyToClipboard').get(0).props.text).toEqual('http://example.com/iiif/manifest');
    });

    it("sets the component's shareLinkText on TextField change", () => {
      wrapper = createWrapper();
      wrapper.find('WithStyles(ForwardRef(TextField))').props().onChange({ target: { value: 'http://example.com/iiif/manifest.json' } });
      expect(wrapper.state().shareLinkText).toEqual('http://example.com/iiif/manifest.json');
    });

    it('does not render the section if the displayShareLink prop is falsey', () => {
      wrapper = createWrapper({ displayShareLink: false });

      expect(wrapper.find('WithStyles(ForwardRef(TextField))').length).toBe(0);
      expect(wrapper.find('CopyToClipboard').length).toBe(1);
    });
  });

  describe('embed section', () => {
    it('is rendered when the displayEmbedOption is true', () => {
      wrapper = createWrapper({ displayEmbedOption: false });
      expect(wrapper.find('WithStyles(MiradorShareEmbed)').length).toBe(0);

      wrapper = createWrapper({ displayEmbedOption: true });
      expect(wrapper.find('WithStyles(MiradorShareEmbed)').length).toBe(1);
    });
  });

  describe('Add to another viewer section', () => {
    it('renders a link, icon, button, and text', () => {
      wrapper = createWrapper();

      expect(wrapper.find('WithStyles(ForwardRef(Grid)) WithStyles(ForwardRef(Link)) IiifIcon').length).toBe(1);
      expect(wrapper.find('WithStyles(ForwardRef(Grid)) CopyToClipboard WithStyles(ForwardRef(Button))').length).toBe(1);
      expect(wrapper.find('WithStyles(ForwardRef(Grid)) WithStyles(ForwardRef(Typography))[variant="body1"]').get(0).props.children).toEqual(
        'Drag & drop IIIF icon to add this resource to any IIIF viewer.',
      );
      expect(wrapper.find('WithStyles(ForwardRef(Grid)) WithStyles(ForwardRef(Typography))[variant="body1"]').get(2).props.children).toEqual(
        'Copy & paste the resource\'s manifest into any IIIF viewer.',
      );
    });

    it('renders the link with IIIF Drag & Drop Compliant URL (passing the manifest in a param)', () => {
      const link = wrapper.find('WithStyles(ForwardRef(Grid)) WithStyles(ForwardRef(Link))').at(0);
      expect(link.props().href).toEqual('http://example.com/abc/iiif/manifest?manifest=http://example.com/abc/iiif/manifest');
    });

    describe('when an info link is configured/passed in as a prop', () => {
      it('renders a "What is IIIF" link', () => {
        wrapper = createWrapper({ iiifInfoLink: 'http://iiif.io/' });
        const link = wrapper.find('WithStyles(ForwardRef(Typography))[variant="body1"] WithStyles(ForwardRef(Link))');
        expect(link.props().children).toEqual('What is IIIF?');
        expect(link.props().href).toEqual('http://iiif.io/');
      });
    });
  });
});
