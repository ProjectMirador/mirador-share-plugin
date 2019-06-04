import mirador from 'mirador';
import miradorSharePlugin from '../../src';
import miradorShareDialogPlugin from '../../src/MiradorShareDialog';

const config = {
  id: 'demo',
  windows: [{
    loadedManifest: 'https://purl.stanford.edu/sn904cj3429/iiif/manifest',
  }],
};

mirador.viewer(config, [
  miradorShareDialogPlugin,
  miradorSharePlugin,
]);
