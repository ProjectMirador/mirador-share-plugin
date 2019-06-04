import React from 'react';
import { shallow } from 'enzyme';
import miradorShareDialog from '../src/MiradorShareDialog';

function createWrapper(props) {
  return shallow(
    <miradorShareDialog.component
      closeShareDialog={() => {}}
      manifestId="http://example.com/abc/iiif/manifest"
      open

      {...props}
    />,
  );
}

describe('Dialog', () => {
  let wrapper;
  it('renders a dialog that is open/closed based on the passed in prop', () => {
    wrapper = createWrapper();
    expect(wrapper.find('WithStyles(Dialog)').props().open).toBe(true);
    wrapper = createWrapper({ open: false });
    expect(wrapper.find('WithStyles(Dialog)').props().open).toBe(false);
  });

  it('renders the section headings in an h3', () => {
    wrapper = createWrapper();
    expect(wrapper.find('WithStyles(Typography)[variant="h3"]').get(0).props.children).toEqual('Share link');
    expect(wrapper.find('WithStyles(Typography)[variant="h3"]').get(1).props.children).toEqual('Embed');
    expect(wrapper.find('WithStyles(Typography)[variant="h3"]').get(2).props.children).toEqual('Alternate viewer');
  });

  it('has a close button that calls closeShareDialog on click', () => {
    const closeShareDialog = jest.fn();
    wrapper = createWrapper({ closeShareDialog });
    wrapper.find('WithStyles(Button)').simulate('click');
    expect(closeShareDialog).toHaveBeenCalled();
  });

  it('has dividers', () => {
    wrapper = createWrapper();
    expect(wrapper.find('WithStyles(Divider)').length).toEqual(2);
  });

  describe('Alternate viewer section', () => {
    it('renders a link, icon, and text', () => {
      wrapper = createWrapper();

      expect(wrapper.find('WithStyles(Typography)[variant="body1"] WithStyles(Link) IiifIcon').length).toBe(1);
      expect(wrapper.find('WithStyles(Typography)[variant="body1"]').props().children[1]).toEqual(
        'Drag & drop this icon to any IIIF viewer.',
      );
    });

    it('renders the link with IIIF Drag & Drop Compliant URL (passing the manifest in a param)', () => {
      expect(wrapper.find('WithStyles(Typography)[variant="body1"] WithStyles(Link)').props().href).toEqual(
        'http://example.com/abc/iiif/manifest?manifest=http://example.com/abc/iiif/manifest',
      );
    });

    describe('when an info link is configured/passed in as a prop', () => {
      it('renders Drag and Drop link with the passed URL as the base (where users will go if they click)', () => {
        wrapper = createWrapper({ dragAndDropInfoLink: 'http://iiif.io/' });

        expect(wrapper.find('WithStyles(Typography)[variant="body1"] WithStyles(Link)').at(0).props().href).toEqual(
          'http://iiif.io/?manifest=http://example.com/abc/iiif/manifest',
        );
      });

      it('renders a "What is IIIF" link', () => {
        wrapper = createWrapper({ dragAndDropInfoLink: 'http://iiif.io/' });
        const link = wrapper.find('WithStyles(Typography)[variant="body1"] WithStyles(Link)').at(1);
        expect(link.props().children).toEqual('What is IIIF?');
        expect(link.props().href).toEqual('http://iiif.io/');
      });
    });
  });
});
