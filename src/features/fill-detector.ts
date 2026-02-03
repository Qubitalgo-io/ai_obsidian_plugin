import { FillMatch } from '../types';

export class FillDetector {
    private static readonly PATTERN = /\[FILL(?::(\d+))?\]/g;

    detect(content: string): FillMatch[] {
        const matches: FillMatch[] = [];
        let match: RegExpExecArray | null;

        const regex = new RegExp(FillDetector.PATTERN.source, 'g');

        while ((match = regex.exec(content)) !== null) {
            const count = match[1] ? parseInt(match[1], 10) : 1;
            matches.push({
                pattern: match[0],
                count,
                startIndex: match.index,
                endIndex: match.index + match[0].length,
                context: this._extractContext(content, match.index)
            });
        }

        return matches;
    }

    private _extractContext(content: string, position: number, lines: number = 10): string {
        const beforeText = content.substring(0, position);
        const afterText = content.substring(position);

        const beforeLines = beforeText.split('\n').slice(-lines).join('\n');
        const afterLines = afterText.split('\n').slice(0, lines).join('\n');

        return `${beforeLines}\n[CONTENT GOES HERE]\n${afterLines}`;
    }

    createPrompt(match: FillMatch): string {
        const paragraphText = match.count === 1 ? 'paragraph' : 'paragraphs';
        return `Based on the following context, generate ${match.count} ${paragraphText} that naturally fits. Only output the generated content, no explanations.\n\nContext:\n${match.context}`;
    }

    replaceFill(content: string, match: FillMatch, replacement: string): string {
        return (
            content.substring(0, match.startIndex) +
            replacement +
            content.substring(match.endIndex)
        );
    }
}
