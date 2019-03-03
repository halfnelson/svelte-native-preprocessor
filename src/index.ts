import MagicString from 'magic-string';
import parseComponent from 'svelte-component-parser'
import { Ast, Node } from 'svelte-component-parser/interfaces';

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

type NodeVisitorAction = (node: Node, depth: number, index: number) => void;

function walkNodes(node: Node, action: NodeVisitorAction, current_depth: number = 0, current_index: number = 0) {
    try {
        action(node, current_depth, current_index)
    } catch (e) {
        throw new Error(`error walking ${node.type} node at depth ${current_depth} index ${current_index} \n ${e.message}`);
    }

    if (!node.children)
        return;

    for (let index of node.children.keys()) {
        walkNodes(node.children[index], action, current_depth + 1, index)
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

function addXmlNamespaceToRootElements(ast: Ast, src: string, dest: MagicString) {
    if (!ast.html) return;
    walkNodes(ast.html, (node: Node, depth: number, index: number) => {
        if (node.type == 'Element' && depth == 1) {
            let xmlnsAttr = node.attributes.find((attr: any) => attr.name == 'xmlns');
            if (!xmlnsAttr) {
                insertAttributeToElement(node, 'xmlns="tns"', src, dest)
            }
        }
    });
}

function expandBindOnTagElements(ast: Ast, src: string, dest: MagicString) {
    if (!ast.html) return;
    walkNodes(ast.html, (node: Node, depth: number, index: number) => {
        if (node.type == 'Element') {
            console.log(node);
        }
    });
}

export default function preprocess() {
    return {
        markup: function (source: SveltePreprocessorInput): SveltePreprocessorOutput {
            //input
            var out = new MagicString(source.content);
            var ast = parseComponent(source.content, { filename: source.file })
            var src = source.content;

            //transforms
            addXmlNamespaceToRootElements(ast, src, out);
            expandBindOnTagElements(ast, src, out);
            
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