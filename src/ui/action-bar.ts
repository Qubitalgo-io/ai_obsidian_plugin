import { App, Editor } from 'obsidian';
import { ActionBarAction } from '../types';

export class ActionBar {
    private _app: App;
    private _containerEl: HTMLElement | null = null;
    private _content: string = '';
    private _onAction: ((action: ActionBarAction) => void) | null = null;

    constructor(app: App) {
        this._app = app;
    }

    show(
        content: string,
        position: { top: number; left: number },
        onAction: (action: ActionBarAction) => void
    ): void {
        this.hide();
        this._content = content;
        this._onAction = onAction;

        this._containerEl = document.createElement('div');
        this._containerEl.className = 'ollama-action-bar';
        this._containerEl.style.top = `${position.top}px`;
        this._containerEl.style.left = `${position.left}px`;

        const actions = [
            { type: 'insert' as const, label: 'Insert Below' },
            { type: 'replace' as const, label: 'Replace' },
            { type: 'copy' as const, label: 'Copy' },
            { type: 'newNote' as const, label: 'New Note' },
            { type: 'dismiss' as const, label: 'Dismiss' }
        ];

        for (const action of actions) {
            const button = document.createElement('button');
            button.className = `ollama-action-btn ollama-action-${action.type}`;
            button.textContent = action.label;
            button.addEventListener('click', () => this._handleAction(action.type));
            this._containerEl.appendChild(button);
        }

        document.body.appendChild(this._containerEl);
    }

    hide(): void {
        if (this._containerEl) {
            this._containerEl.remove();
            this._containerEl = null;
        }
    }

    private _handleAction(type: ActionBarAction['type']): void {
        if (!this._onAction) return;
        this._onAction({ type, content: this._content });
        this.hide();
    }

    insertBelow(editor: Editor, content: string): void {
        const cursor = editor.getCursor();
        const line = cursor.line;
        editor.replaceRange('\n' + content, { line, ch: editor.getLine(line).length });
    }

    replaceSelection(editor: Editor, content: string): void {
        editor.replaceSelection(content);
    }

    async copyToClipboard(content: string): Promise<void> {
        await navigator.clipboard.writeText(content);
    }

    async createNewNote(content: string): Promise<void> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `Generated-${timestamp}.md`;
        await this._app.vault.create(filename, content);
        const file = this._app.vault.getAbstractFileByPath(filename);
        if (file) {
            await this._app.workspace.openLinkText(filename, '', true);
        }
    }
}
