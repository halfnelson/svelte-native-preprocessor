import preprocess, { SveltePreprocessorDefinition } from "../src"
import * as assert from 'assert';

describe("preprocess", function () {
    let p: SveltePreprocessorDefinition;
   
    function testMarkup(input: string, expected: string) {
        let res = p.markup({ content: input, filename: 'Index.svelte' });
        assert.equal(res.code, expected);
    }

    //wraps input in a page element so we don't have to account for the xmlns attributes
    function testElementMarkup(input: string, expected: string) {
        let content =  `<page>\n${input}\n</page>`;
        let res = p.markup({ content: content, filename: 'Index.svelte' });

        let codeLines = res.code.split('\n');
        codeLines.shift();
        codeLines.pop()

        assert.strictEqual(codeLines.join('\n'), expected);
    }

    beforeEach(function () {
        p = preprocess();
    });

    it('should process empty file', function () {
        testMarkup('', '');
    });
    describe("preprocess adds expands bind: attribute", function () {
        it('should not expand bind on svelte components', function() {
            testElementMarkup('<SvelteComponent bind:a={this} />','<SvelteComponent bind:a={this} />')
        });

        it('should not expand bind on svelte tags', function() {
            testElementMarkup('<svelte:component this={SvelteComponent} bind:a={this} />','<svelte:component this={SvelteComponent} bind:a={this} />')
        });

        it('should expand bind on regular tags', function() {
            testElementMarkup('<textInput bind:text={email} />','<textInput text="{email}" on:textChange="{(e) => email = e.value}" />')
        });

        it('should expand bind with complex lvalues', function() {
            testElementMarkup('<textInput bind:text={user.contactDetais[i].email} />','<textInput text="{user.contactDetais[i].email}" on:textChange="{(e) => user.contactDetais[i].email = e.value}" />')
        });

        it('should not expand bind:this on regular tags', function() {
            testElementMarkup('<textInput bind:this={myinput} />','<textInput bind:this={myinput} />')
        });

        it('should try to bind to each scope variables', function() {
            testElementMarkup('{#each collection as item}<textInput bind:text={item} />{/each}','{#each collection as item}<textInput text="{item}" on:textChange="{(e) => item = e.value}" />{/each}')
        });

        it(`should bind to nested items`, function() {
            testElementMarkup(
                '{#if true}<label>True</label>{:else}<textField bind:text={username} />{/if}',
                '{#if true}<label>True</label>{:else}<textField text="{username}" on:textChange="{(e) => username = e.value}" />{/if}'
            );
        })
    });

    describe('preprocess should handle typescript', function() {
        it(`should not crash on ts scripts`, function() {
            testElementMarkup(
                '<script lang="typescript"> let message: string = "Blank Svelte Native App" </script>',
                '<script lang="typescript"> let message: string = "Blank Svelte Native App" </script>'
            )
        })
    })
    
})