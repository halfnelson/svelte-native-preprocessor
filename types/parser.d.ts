declare module 'svelte/compiler' {
    export interface Node {
        start: number;
        end: number;
        type: string;
        [propName: string]: any;
    }
   
    export interface Ast {
        html: Node;
        css: Node;
        instance: Node;
        module: Node;
    }
   
    export interface CustomElementOptions {
        tag?: string;
        props?: string[];
    }
   
    interface ParserOptions {
        filename?: string;
        bind?: boolean;
        customElement?: CustomElementOptions | true;
    }
  
    export function parse(template: string, options?: ParserOptions): Ast;
    export function walk(node: Node, handlers: { enter?: (node: Node, parent: Node, prop: string, index: number) => void } ): void;
}