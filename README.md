# Mirador Share Plugin

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]

`mirador-share-plugin` is a [Mirador 3](https://github.com/ProjectMirador/mirador) plugin that adds the several options for sharing a resource to the window options menu. Options include specifying embedded `<iframe>` options and a preferred share link.

- [Live demo](https://mirador-share-plugin.netlify.com/)
- [Sample configuration](https://github.com/ProjectMirador/mirador-share-plugin/blob/master/demo/src/index.js)

![share-button-in-menu](https://github.com/ProjectMirador/mirador-share-plugin/assets/40801910/d87cd4c2-346c-4785-9b3d-6318803e9f06)

![sharing options window - share link, iframe, and drag and drop](https://github.com/ProjectMirador/mirador-share-plugin/assets/40801910/1b0ed83c-2af4-4bb8-9603-7c981681ee54)

## Installation

`mirador-share-plugin` requires an instance of Mirador 3. See the [Mirador wiki](https://github.com/ProjectMirador/mirador/wiki) for examples of embedding Mirador within an application and additional information about plugins. See the [live demo's index.js](https://github.com/ProjectMirador/mirador-share-plugin/blob/master/demo/src/index.js) for an example of importing and configuring `mirador-share-plugin`.

## Configuration

Configurations for this plugin are injected when Mirador is initialized under the `miradorSharePlugin` key.

```js
...
  id: 'mirador',
  miradorSharePlugin: {
    ...
  }
...
```

| Config Key | Type | Description |
| --- | --- | --- |
| `iiifInfoLink` | string/url | Provides a `What is IIIF` link under the Add to another viewer section that points to the configured URL |
| `embedOption` | object | The configuration objects for the Embed section. You can use this if you're able to easily modify the manifest ID to a URL that can be used to embed the resource in an `<iframe>` (most likely in embedded mode where you're only displaying your own content) |
| `embedOption.enabled` | boolean | Configure whether to render the Embed section in the Share Dialog. |
| `embedOption.embedIframeAttributes` | string | A string that contains HTML attributes to be applied to the `<iframe>` embed code. (Default: `allowfullscreen frameborder="0"`) |
| `embedOption.embedIframeTitle` | string | A string to be used as the title element of the `<iframe>` embed code. (Default: "Image viewer") |
| `embedOption.embedUrlReplacePattern` | array | An array that represents the two options to the javascript string `replace` function. When `embedOption.enabled` is `true` this config will be used to modify the manifestId prop (using the `replace` function) to generate the url that will be used as the `src` of the `<iframe>` embed code. |
| `embedOption.syncIframeDimensions` | object | Provide this configuration object to sync particular `<iframe>` size dimensions to Embed URL parameters. Example: `syncIframeDimensions: { height: { param: 'maxheight' } }` will attach a `maxheight` parameter to the URL in the `<iframe>` embed code. Supported dimensions are `height` and `width`. |
| `shareLink` | object | The configuration objects for the Share link section. You can use this if you're able to easily modify the manifest ID to the link to the resource (most likely in embedded mode where you're only displaying your own content) |
| `shareLink.enabled` | boolean | Configure whether to render the Share link section in the Share Dialog. |
| `shareLink.manifestIdReplacePattern` | array | An array that represents the two options to the javascript string `replace` function. When `shareLink.enabled` is `true` this config will be used to modify the manifestId prop (using the `replace` function) to generate the share link. |

## Contribute
Mirador's development, design, and maintenance is driven by community needs and ongoing feedback and discussion. Join us at our regularly scheduled community calls, on [IIIF slack #mirador](http://bit.ly/iiif-slack), or the [mirador-tech](https://groups.google.com/forum/#!forum/mirador-tech) and [iiif-discuss](https://groups.google.com/forum/#!forum/iiif-discuss) mailing lists. To suggest features, report bugs, and clarify usage, please submit a GitHub issue.

[build-badge]: https://img.shields.io/travis/projectmirador/mirador-share-plugin/master.png?style=flat-square
[build]: https://travis-ci.org/projectmirador/mirador-share-plugin

[npm-badge]: https://img.shields.io/npm/v/mirador-share-plugin.png?style=flat-square
[npm]: https://www.npmjs.org/package/mirador-share-plugin
