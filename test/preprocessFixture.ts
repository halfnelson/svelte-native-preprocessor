import preprocess, { SveltePreprocessorDefinition } from "../src"
import * as assert from 'assert';

describe("preprocess", function () {
    let p: SveltePreprocessorDefinition;

    beforeEach(function () {
        p = preprocess();
    });

    it('should add process empty file', function () {
        let res = p.markup({ content: '', file: 'Index.svelte' });
        assert.equal(res.code, "");
    });
})