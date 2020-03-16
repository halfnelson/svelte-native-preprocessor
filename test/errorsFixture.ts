import preprocess, { SveltePreprocessorDefinition } from "../src"
import * as assert from 'assert';

describe("preprocess errors", function () {
    let p: SveltePreprocessorDefinition;
    let generatedError: Error;

    beforeEach(function () {
        p = preprocess();
        let content =  `<page>\n<#!invalidTag<\n</page>`;
        try {
            let res = p.markup({ content: content, file: 'Index.svelte' });
            assert.fail("didn't through at all")
        } catch (e) {
            generatedError = e;
        }
    })

    it('should contain our prefixname ', function () {
        assert.strictEqual(generatedError.name, "SvelteNativePreprocessor/ParseError")
    });

    it('should contain the location in the message', function() {
        assert.ok(generatedError.message.match(/\(2:1\)/g), `Error message didn't contain line number. We got: ${generatedError.message}`)
    })

    it('should contain the file name in the message', function() {
        assert.ok(generatedError.message.match(/Index\.svelte/g), `Error message didn't contain the file name. We got: ${generatedError.message}`)
    })

});