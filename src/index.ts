import MagicString from 'magic-string';
import { Node, walk } from 'svelte/compiler';
import { parseHtmlx } from './htmlxparser'


export interface SveltePreprocessorInput {
    content: string;
    filename: string;
}
export interface SveltePreprocessorOutput {
    code: string;
    map: string;
}
export interface SveltePreprocessorDefinition {
    markup: (source: SveltePreprocessorInput) => SveltePreprocessorOutput;
}

export default function preprocess() {
    return {
        markup: function (source: SveltePreprocessorInput): SveltePreprocessorOutput {
            //input
            var out = new MagicString(source.content);
            var src = source.content;

            const expandBindOnTagElements = (node: Node) => {
                if (node.type == 'Element') {
                    for (let binding of (node.attributes || []).filter((a: any) => a.type == 'Binding')) {
                        let prop = binding.name;
                        if (prop == "this") 
                            continue; 
                        let variable = src.substring(binding.expression.start, binding.expression.end); 
                        console.log(`node binding ${prop} = ${variable}` )
                        //remove the bind
                        out.overwrite(binding.start, binding.end, `${prop}="{${variable}}" on:${prop}Change="{(e) => ${variable} = e.value}"` )
                    }
                }
            };
            
            //apply transforms
            try {
                var ast = parseHtmlx(source.content);
            } catch (e) {
                //convert svelte CompilerError to string for our loader (rollup/webpack)
                var error = new Error(`${source.filename ? `${source.filename} :` : ""}${e.toString()}`);
                error.name = `SvelteNativePreprocessor/${e.name}`
                throw error;
            }
           
            walk(ast, { 
                enter: (node: Node, parent: Node, prop: string, index: number) => {
                    expandBindOnTagElements(node);
                }
            })
  
            //output
            var map = out.generateMap({
                source: source.filename,
                file: source.filename + ".map",
                includeContent: true
            });
            return { code: out.toString(), map: map.toString() };
        }
    }
}