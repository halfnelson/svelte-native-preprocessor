import { add } from "../dist/index"
import * as assert from 'assert';

describe("add", function() {
    it('it should add', function() {
        assert.equal(add(5,1), 6);
    });
})