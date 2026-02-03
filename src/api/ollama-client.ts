import {
    GenerateRequest,
    ChatRequest,
    GenerateResponse,
    ChatResponse,
    TagsResponse,
    ModelInfo,
    Message
} from '../types';

export class OllamaClient {
    private _baseUrl: string;
    private _abortController: AbortController | null = null;

    constructor(baseUrl: string) {
        this._baseUrl = baseUrl.replace(/\/$/, '');
    }

    setBaseUrl(url: string): void {
        this._baseUrl = url.replace(/\/$/, '');
    }

    async testConnection(): Promise<boolean> {
        try {
            const response = await fetch(`${this._baseUrl}/api/tags`);
            return response.ok;
        } catch {
            return false;
        }
    }

    async fetchModels(): Promise<ModelInfo[]> {
        const response = await fetch(`${this._baseUrl}/api/tags`);
        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.statusText}`);
        }
        const data: TagsResponse = await response.json();
        return data.models || [];
    }

    async generate(
        request: GenerateRequest,
        onChunk?: (chunk: string) => void
    ): Promise<string> {
        this._abortController = new AbortController();

        const response = await fetch(`${this._baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
            signal: this._abortController.signal
        });

        if (!response.ok) {
            throw new Error(`Generation failed: ${response.statusText}`);
        }

        if (!request.stream) {
            const data: GenerateResponse = await response.json();
            return data.response;
        }

        return this._processStream<GenerateResponse>(response, onChunk, (data) => data.response);
    }

    async chat(
        request: ChatRequest,
        onChunk?: (chunk: string) => void
    ): Promise<Message> {
        this._abortController = new AbortController();

        const response = await fetch(`${this._baseUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
            signal: this._abortController.signal
        });

        if (!response.ok) {
            throw new Error(`Chat failed: ${response.statusText}`);
        }

        if (!request.stream) {
            const data: ChatResponse = await response.json();
            return data.message;
        }

        const content = await this._processStream<ChatResponse>(
            response,
            onChunk,
            (data) => data.message?.content || ''
        );

        return { role: 'assistant', content };
    }

    abort(): void {
        if (this._abortController) {
            this._abortController.abort();
            this._abortController = null;
        }
    }

    private async _processStream<T>(
        response: Response,
        onChunk: ((chunk: string) => void) | undefined,
        extractContent: (data: T) => string
    ): Promise<string> {
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let fullContent = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value, { stream: true });
                const lines = text.split('\n').filter(line => line.trim());

                for (const line of lines) {
                    try {
                        const data: T = JSON.parse(line);
                        const content = extractContent(data);
                        if (content) {
                            fullContent += content;
                            onChunk?.(content);
                        }
                    } catch {
                        continue;
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }

        return fullContent;
    }
}
