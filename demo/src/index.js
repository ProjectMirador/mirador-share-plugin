import Mirador from 'mirador';
import miradorSharePlugins from '../../src';

const config = {
  id: 'demo',
  miradorSharePlugin: {
    embedOption: {
      embedUrlReplacePattern: [
        /.*\.edu\/(\w+)\/iiif\/manifest/,
        'https://embed.stanford.edu/iframe?url=https://purl.stanford.edu/$1',
      ],
      syncIframeDimensions: {
        height: { param: 'maxheight' },
      },
    },
    enabled: true,
    iiifInfoLink: 'https://iiif.io',
    shareLink: {
      enabled: true,
      manifestIdReplacePattern: [/\/iiif\/manifest/, ''],
    },
  },
  windows: [
    {
      loadedManifest: 'https://purl.stanford.edu/sn904cj3429/iiif/manifest',
    },
  ],
};

Mirador.viewer(config, [...miradorSharePlugins]);
