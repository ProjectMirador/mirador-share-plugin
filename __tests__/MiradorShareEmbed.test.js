import { cloneElement } from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from './utils/test-utils';
import MiradorShareEmbed from '../src/MiradorShareEmbed';

/** Utility function to wrap  */
function createWrapper(props) {
  const component = (
    <MiradorShareEmbed
      embedIframeAttributes='allowfullscreen frameborder="0"'
      embedIframeTitle="Title Prop"
      embedUrlReplacePattern={[]}
      manifestId="https://example.com/abc123/iiif/manifest"
      {...props}
    />
  );
  return { component, ...render(component) };
}

describe('MiradorShareEmbed', () => {
  it('renders fieldsets w/ legends or labels for each section of the embed component', () => {
    createWrapper();

    expect(screen.getAllByRole('group')).toHaveLength(3);

    expect(screen.getByText('miradorSharePlugin.selectViewerSize', { component: 'legend' })).toBeInTheDocument();
    expect(screen.getByText('miradorSharePlugin.copyAndPasteCode', { component: 'legend' })).toBeInTheDocument();
  });

  it('renders a radio group w/ a form control for each of the size options', () => {
    createWrapper();

    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['560x420', '640x480', '800x600', '1024x768', 'miradorSharePlugin.buttonCopy']);
  });

  it('renders the embed code in a text field', () => {
    createWrapper();

    expect(screen.getByRole('textbox').value).toContain('<iframe');
    expect(screen.getByText('miradorSharePlugin.copyAndPasteCode', { component: 'button' })).toBeInTheDocument();
  });

  it('uses the embedUrlReplacePattern prop to generate the embed URL', () => {
    const embedUrlReplacePattern = [
      /.*example\.com\/(\w+)\/iiif\/manifest/,
      'https://embed.example.com/embed?url=https://example.com/$1',
    ];
    createWrapper({ embedUrlReplacePattern });
    expect(screen.getByRole('textbox').value).toContain('https://embed.example.com/embed?url=https://example.com/abc123');
  });

  it('renders the iframe title passed in', () => {
    createWrapper({ embedIframeTitle: 'A configured title' });
    expect(screen.getByRole('textbox').value).toContain('title="A configured title"');
  });

  it('adds the height/width to the Embed URL using the given param', () => {
    const { component, rerender } = createWrapper({ syncIframeDimensions: { height: { param: 'maxheight' } } });
    expect(screen.getByLabelText('miradorSharePlugin.copyAndPasteCode').value).toMatch(/iiif\/manifest&maxheight=420/);

    rerender(cloneElement(component, { syncIframeDimensions: { width: { param: 'maxwidth' } } }));
    expect(screen.getByLabelText('miradorSharePlugin.copyAndPasteCode').value).toMatch(/iiif\/manifest&maxwidth=560/);

    rerender(cloneElement(component, { syncIframeDimensions: { height: { param: 'maxheight' }, width: { param: 'maxwidth' } } }));
    expect(screen.getByLabelText('miradorSharePlugin.copyAndPasteCode').value).toMatch(/iiif\/manifest&maxwidth=560&maxheight=420/);
  });

  it('the embed code gets its height and width from state', async () => {
    createWrapper();

    expect(screen.getByRole('textbox').value).toMatch(/width="560" height="420"/);
    await userEvent.click(screen.getByText('800x600'));
    expect(screen.getByRole('textbox').value).toMatch(/width="800" height="600"/);
  });
});
