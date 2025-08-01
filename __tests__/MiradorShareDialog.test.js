import userEvent from '@testing-library/user-event';
import { render, screen } from './utils/test-utils';
import miradorShareDialog from '../src/MiradorShareDialog';

function createWrapper(props) {
  return render(
    <miradorShareDialog.component
      closeShareDialog={() => {}}
      containerId="container-123"
      displayEmbedOption
      displayShareLink
      manifestId="http://example.com/abc/iiif/manifest"
      open
      {...props}
    />,
  );
}

describe('Dialog', () => {
  it('renders a dialog based on the passed in open prop', () => {
    createWrapper();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render a dialog when the open prop is false', () => {
    createWrapper({ open: false });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the section headings in an h3', () => {
    createWrapper();

    expect(screen.getByText('miradorSharePlugin.shareLink', { selector: 'h3' })).toBeInTheDocument();
    expect(screen.getByText('miradorSharePlugin.embed', { selector: 'h3' })).toBeInTheDocument();
    expect(screen.getByText('miradorSharePlugin.addToAnotherViewer', { selector: 'h3' })).toBeInTheDocument();
  });

  it('has a close button that calls closeShareDialog on click', () => {
    const closeShareDialog = vi.fn();
    createWrapper({ closeShareDialog });
    screen.getByRole('button', { name: 'miradorSharePlugin.buttonClose' }).click();
    expect(closeShareDialog).toHaveBeenCalled();
  });

  describe('Share link section', () => {
    it('renders the section w/ a TextField and a Copy Button', () => {
      createWrapper();

      expect(screen.getByLabelText('miradorSharePlugin.ariaShareLinkUrl', { selector: 'input' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'miradorSharePlugin.ariaCopyToClipboard' })).toBeInTheDocument();
    });

    it('allows the user to change the embed URL', async () => {
      createWrapper();

      await userEvent.type(screen.getByLabelText('miradorSharePlugin.ariaShareLinkUrl', { selector: 'input' }), '?xyz');
      screen.findByRole('textbox', { value: 'http://example.com/abc/iiif/manifest?xyz' }).then(() => {
        expect(screen.getByLabelText('miradorSharePlugin.ariaShareLinkUrl', { selector: 'input' }).value).toEqual('http://example.com/abc/iiif/manifest?xyz');
      });
    });

    it('does not render the section if the displayShareLink prop is falsey', () => {
      createWrapper({ displayShareLink: false });
      expect(screen.queryByLabelText('miradorSharePlugin.ariaShareLinkUrl', { selector: 'input' })).not.toBeInTheDocument();
    });
  });

  describe('embed section', () => {
    it('is rendered when the displayEmbedOption is true', () => {
      createWrapper({ displayEmbedOption: false });
      expect(screen.queryByText('miradorSharePlugin.embed', { selector: 'h3' })).not.toBeInTheDocument();
      expect(screen.queryByLabelText('miradorSharePlugin.selectViewerSize')).not.toBeInTheDocument();

      createWrapper({ displayEmbedOption: true });
      expect(screen.getByText('miradorSharePlugin.embed', { selector: 'h3' })).toBeInTheDocument();
      expect(screen.getByLabelText('miradorSharePlugin.ariaSelectViewerSize')).toBeInTheDocument();
    });
  });

  describe('Add to another viewer section', () => {
    it('renders text', () => {
      createWrapper();

      expect(screen.getByText('miradorSharePlugin.iconDragAndDrop')).toBeInTheDocument();
      expect(screen.getByText('miradorSharePlugin.copyAndPasteManifest')).toBeInTheDocument();
    });

    it('renders the link with IIIF Drag & Drop Compliant URL (passing the manifest in a param)', () => {
      createWrapper();

      expect(screen.getByLabelText('miradorSharePlugin.ariaDragIcon')).toHaveAttribute('href', 'http://example.com/abc/iiif/manifest?manifest=http://example.com/abc/iiif/manifest');
    });

    describe('when an info link is configured/passed in as a prop', () => {
      it('renders a "What is IIIF" link', () => {
        createWrapper({ iiifInfoLink: 'http://iiif.io/' });

        expect(screen.getByText('miradorSharePlugin.whatIsIiif')).toHaveAttribute('href', 'http://iiif.io/');
      });
    });
  });
});
