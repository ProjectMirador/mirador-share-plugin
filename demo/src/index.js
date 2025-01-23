import Mirador from "mirador/dist/es/src/index";
import miradorSharePlugins from '../../src';

const config = {
  id: 'demo',
  windows: [{
    loadedManifest: 'https://purl.stanford.edu/sn904cj3429/iiif/manifest',
  }],
  miradorSharePlugin: {
    iiifInfoLink: 'https://iiif.io',
    embedOption: {
      enabled: true,
      embedUrlReplacePattern: [
        /.*\.edu\/(\w+)\/iiif\/manifest/,
        'https://embed.stanford.edu/iframe?url=https://purl.stanford.edu/$1',
      ],
      syncIframeDimensions: {
        height: { param: 'maxheight' },
      },
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
  ...miradorSharePlugins,
]);
