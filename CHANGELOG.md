## Changes

1.0.0 2021-04-09
    - **BREAKING** doesn't introduce a namespace element. Use ` compilerOptions: { namespace: 'foreign' } ` in svelte.config.js instead ( requires nativescript webpack 5.0.0 )

0.2.0 2020-07-24
    - use htmlxparser instead of svelte to unblock typescript support

0.1.8 2020-04-22
    - Provide umd module to support repl usage

0.1.7 2020-03-16
    - Improve parse error messages to include filename, position, and source frame

0.1.6 2020-02-18
    - Handle if blocks correctly
    - Use svelte's built in ast walker

0.1.2   2019-05-18
    - Changed from adding xmlns="tns" on top level elements to adding a `<svelte:options namespace="xmlns"/>` element.