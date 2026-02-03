import { Message, ConversationEntry } from '../types';

export class ConversationHistory {
    private _conversations: Map<string, ConversationEntry> = new Map();

    getMessages(noteId: string): Message[] {
        const entry = this._conversations.get(noteId);
        return entry?.messages || [];
    }

    addMessage(noteId: string, message: Message): void {
        let entry = this._conversations.get(noteId);

        if (!entry) {
            entry = {
                noteId,
                messages: [],
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            this._conversations.set(noteId, entry);
        }

        entry.messages.push(message);
        entry.updatedAt = Date.now();
    }

    addUserMessage(noteId: string, content: string): void {
        this.addMessage(noteId, { role: 'user', content });
    }

    addAssistantMessage(noteId: string, content: string): void {
        this.addMessage(noteId, { role: 'assistant', content });
    }

    clearConversation(noteId: string): void {
        this._conversations.delete(noteId);
    }

    clearAll(): void {
        this._conversations.clear();
    }

    hasConversation(noteId: string): boolean {
        return this._conversations.has(noteId);
    }

    getConversationContext(noteId: string, maxMessages: number = 10): Message[] {
        const messages = this.getMessages(noteId);
        if (messages.length <= maxMessages) {
            return messages;
        }
        return messages.slice(-maxMessages);
    }
}
