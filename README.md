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
| :------------- | :------------- |
| `dragAndDropInfoLink` | string/url | Provides a `What is IIIF` link under the Alternate Viewers / Drag & Drop that points to the configured URL. This will also be the base of the Drag & Drop link so that if a user clicks instead of drags, they will go the informational page (as opposed to the manifest which is the default behavior) |


[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
