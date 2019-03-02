# Svelte Native Preprocessor

A preprocessor for [Svelte-Native](https://github.com/halfnelson/svelte-native).

It performs the following transforms to provide a better developer experience when using Svelte-Native


## Installation

Using svelte-loader, in `webpack.config.js`

```js
const svelteNativePreprocessor = require("./svelte-native-preprocess");
```

and where the `svelte-loader` is registered add it to the options:

```js
 {
    test: /\.svelte$/,
    exclude: /node_modules/,
    use: [
        { 
            loader: 'svelte-loader',
            options: {
                preprocess: svelteNativePreprocessor()
            }
        }
    ]
},
```

Similar process for `rollup-plugin-svelte` but users of that library are usually skilled enough to work it out ;)


## License

[MIT](LICENSE).
