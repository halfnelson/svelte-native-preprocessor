# Svelte Native Preprocessor

A pre processor for [Svelte-Native](https://github.com/halfnelson/svelte-native).

It performs the following transforms to provide a better developer experience when using Svelte-Native:

 - [x] Changes `bind:text="{email}"` to `text="{email}" on:textChanged="{e => email = e.value}"`
 

## Installation

Using `nativescript-webpack >= 5.0.0` add to your `svelte.config.js`

```js
const svelteNativePreprocessor = require("./svelte-native-preprocessor");

module.exports = {
    compilerOptions: {
        namespace: 'foreign'
    },
    preprocess: [svelteNativePreprocessor() /*, other preprocesser eg sveltePreprocessor() here */]
}
```

## License

[MIT](LICENSE).
