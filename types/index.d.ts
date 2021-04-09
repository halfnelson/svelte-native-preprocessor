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
export default function preprocess(): SveltePreprocessorDefinition;
