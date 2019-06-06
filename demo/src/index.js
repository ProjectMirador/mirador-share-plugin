import mirador from 'mirador';
import miradorSharePlugin from '../../src';
import miradorShareDialogPlugin from '../../src/MiradorShareDialog';

const config = {
  id: 'demo',
  windows: [{
    loadedManifest: 'https://purl.stanford.edu/sn904cj3429/iiif/manifest',
  }],
  miradorSharePlugin: {
    dragAndDropInfoLink: 'https://iiif.io',
    shareLink: {
      enabled: true,
      manifestIdReplacePattern: [
        /\/iiif\/manifest/,
        '',
      ],
    },
  },
};

mirador.viewer(config, [
  miradorShareDialogPlugin,
  miradorSharePlugin,
]);
