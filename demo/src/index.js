import Mirador from 'mirador/dist/es/src/index';
import miradorSharePlugin from '../../src';
import miradorShareDialogPlugin from '../../src/MiradorShareDialog';

const config = {
  id: 'demo',
  windows: [{
    loadedManifest: 'https://purl.stanford.edu/sn904cj3429/iiif/manifest',
  }],
  miradorSharePlugin: {
    dragAndDropInfoLink: 'https://iiif.io',
    embedOption: {
      enabled: true,
      embedUrlReplacePattern: [
        /.*\.edu\/(\w+)\/iiif\/manifest/,
        'https://embed.stanford.edu/iframe?url=https://purl.stanford.edu/$1',
      ],
    },
    shareLink: {
      enabled: true,
      manifestIdReplacePattern: [
        /\/iiif\/manifest/,
        '',
      ],
    },
  },
};

Mirador.viewer(config, [
  miradorShareDialogPlugin,
  miradorSharePlugin,
]);
