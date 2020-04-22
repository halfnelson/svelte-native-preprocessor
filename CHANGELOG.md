## Changes
0.1.8 2020-04-22
    - Provide umd module to support repl usage

0.1.7 2020-03-16
    - Improve parse error messages to include filename, position, and source frame

0.1.6 2020-02-18
    - Handle if blocks correctly
    - Use svelte's built in ast walker

0.1.2   2019-05-18
    - Changed from adding xmlns="tns" on top level elements to adding a `<svelte:options namespace="xmlns"/>` element.