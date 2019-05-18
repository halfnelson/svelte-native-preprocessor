# Svelte Native Preprocessor

A preprocessor for [Svelte-Native](https://github.com/halfnelson/svelte-native).

It performs the following transforms to provide a better developer experience when using Svelte-Native:

 - [x] Adds `<svelte:options namespace="xmlns" />` to the component, ensuring the generated code is compatible with svelte-native
 - [x] Changes `bind:text="{email}"` to `text="{email}" on:textChanged="{e => email = e.value}"`
 

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

There is a similar process for `rollup-plugin-svelte`, but users of that library are usually skilled enough to work it out ;)


## License

[MIT](LICENSE).
