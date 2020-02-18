import MagicString from 'magic-string';
import { Node, parse } from 'svelte/compiler';
import * as svelte from 'svelte/compiler';

export interface SveltePreprocessorInput {
    content: string;
    file: string;
}
export interface SveltePreprocessorOutput {
    code: string;
    map: string;
}
export interface SveltePreprocessorDefinition {
    markup: (source: SveltePreprocessorInput) => SveltePreprocessorOutput;
}

type NodeVisitorAction = (node: Node, parents: Node[], index: number) => void;

function walkNodes(node: Node, action: NodeVisitorAction, parentNodes: Node[] = [], current_index: number = 0) {
    try {
        action(node, parentNodes, current_index)
    } catch (e) {
        throw new Error(`error walking ${node.type} node at depth ${parentNodes.length} index ${current_index} \n ${e.message}`);
    }

    if (!node.children)
        return;

    let parents = parentNodes.concat(node);
    for (let index of node.children.keys()) {
        walkNodes(node.children[index], action, parents, index)
    }
}

function isWhiteSpace(char: string) {
    return char == ' ' || char == '\n' || char == '\t' || char == '\r';
}

function insertAttributeToElement(element: Node, attributeString: string, src: string, dest: MagicString) {
    let insertIdx = src.indexOf(element.name, element.start) + element.name.length;
    let insertStr = ` ${attributeString}` + (isWhiteSpace(src[insertIdx]) ? '' : ' ');
    dest.appendRight(insertIdx, insertStr);
}

export default function preprocess() {
    return {
        markup: function (source: SveltePreprocessorInput): SveltePreprocessorOutput {
            //input
            var out = new MagicString(source.content);
            var src = source.content;

            var processedExistingOptionsAttribute = false;

            const addXmlNamespaceToSvelteOptions = (node: Node) => {
                if (node.type != 'Options') return;
                processedExistingOptionsAttribute = true;
                let namespaceAttr = node.attributes.find((attr: any) => attr.name == 'namespace');
                if (!namespaceAttr) {
                    insertAttributeToElement(node, 'namespace="xmlns"', src, out)
                }
            };

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
            
            const appendOptionWithNamespace = () => {
                out.prepend('<svelte:options namespace="xmlns"/>')
            }
            
            //apply transforms
            var ast = parse(source.content, { filename: source.file });
           
            (svelte as any).walk(ast.html, { 
                enter: (node: Node, parent: Node, prop: string, index: number) => {
                    addXmlNamespaceToSvelteOptions(node);
                    expandBindOnTagElements(node);
                }
            })
  
            if (!processedExistingOptionsAttribute) {
                appendOptionWithNamespace();
            }

            //output
            var map = out.generateMap({
                source: source.file,
                file: source.file + ".map",
                includeContent: true
            });
            return { code: out.toString(), map: map.toString() };
        }
    }
}