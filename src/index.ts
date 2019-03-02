import  MagicString  from 'magic-string';

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

export default function preprocess() {
    return {
        markup: function(source: SveltePreprocessorInput ): SveltePreprocessorOutput {
            var src = new MagicString(source.content);
            var map = src.generateMap({
                source: source.file,
                file: source.file + ".map",
                includeContent: true
            });
            return { code: src.toString(), map: map.toString() };
        }
    }
}