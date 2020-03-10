# Mirador Share Plugin

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

## Configuration

### dragAndDropInfoLink (url)

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
| `dragAndDropInfoLink` | string/url | Provides a `What is IIIF` link under the Alternate Viewers / Drag & Drop that points to the configured URL. This will also be the base of the Drag & Drop link so that if a user clicks instead of drags, they will go the informational page (as opposed to the manifest which is the default behavior) |
| `embedOption` | object | The configuration objects for the Embed section. You can use this if you're able to easily modify the manifest ID to a URL that can be used to embed the resource in an `<iframe>` (most likely in embedded mode where you're only displaying your own content) |
| `embedOption.enabled` | boolean | Configure whether to render the Embed section in the Share Dialog. |
| `embedOption.embedIframeTitle` | string | A string to be used as the title element of the `<iframe>` embed code. (Default: "Image viewer") |
| `embedOption.embedUrlReplacePattern` | array | An array that represents the two options to the javascript string `replace` function. When `embedOption.enabled` is `true` this config will be used to modify the manifestId prop (using the `replace` function) to generate the url that will be used as the `src` of the `<iframe>` embed code. |
| `shareLink` | object | The configuration objects for the Share link section. You can use this if you're able to easily modify the manifest ID to the link to the resource (most likely in embedded mode where you're only displaying your own content) |
| `shareLink.enabled` | boolean | Configure whether to render the Share link section in the Share Dialog. |
| `shareLink.manifestIdReplacePattern` | array | An array that represents the two options to the javascript string `replace` function. When `shareLink.enabled` is `true` this config will be used to modify the manifestId prop (using the `replace` function) to generate the share link. |


[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
