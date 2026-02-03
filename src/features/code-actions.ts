import { CodeBlockInfo } from '../types';

export class CodeActions {
    private static readonly CODE_BLOCK_PATTERN = /```(\w+)?\n([\s\S]*?)```/g;

    detectCodeBlocks(content: string): CodeBlockInfo[] {
        const blocks: CodeBlockInfo[] = [];
        let match: RegExpExecArray | null;

        const regex = new RegExp(CodeActions.CODE_BLOCK_PATTERN.source, 'g');

        while ((match = regex.exec(content)) !== null) {
            const startLine = content.substring(0, match.index).split('\n').length;
            const endLine = startLine + match[0].split('\n').length - 1;

            blocks.push({
                language: match[1] || 'plaintext',
                content: match[2],
                startLine,
                endLine
            });
        }

        return blocks;
    }

    findBlockAtPosition(content: string, position: number): CodeBlockInfo | null {
        const blocks = this.detectCodeBlocks(content);

        for (const block of blocks) {
            const lines = content.split('\n');
            let charCount = 0;

            for (let i = 0; i < lines.length; i++) {
                charCount += lines[i].length + 1;
                if (charCount > position) {
                    const lineNumber = i + 1;
                    if (lineNumber >= block.startLine && lineNumber <= block.endLine) {
                        return block;
                    }
                    break;
                }
            }
        }

        return null;
    }

    createExplainPrompt(block: CodeBlockInfo): string {
        return `Explain the following ${block.language} code in detail:\n\n\`\`\`${block.language}\n${block.content}\`\`\``;
    }

    createCommentPrompt(block: CodeBlockInfo): string {
        return `Add clear and concise inline comments to the following ${block.language} code. Return only the commented code:\n\n\`\`\`${block.language}\n${block.content}\`\`\``;
    }

    createConvertPrompt(block: CodeBlockInfo, targetLanguage: string): string {
        return `Convert the following ${block.language} code to ${targetLanguage}. Return only the converted code:\n\n\`\`\`${block.language}\n${block.content}\`\`\``;
    }

    createFindIssuesPrompt(block: CodeBlockInfo): string {
        return `Analyze the following ${block.language} code and identify any potential bugs, issues, or improvements:\n\n\`\`\`${block.language}\n${block.content}\`\`\``;
    }
}
