# Copilot Instructions for Ollama Obsidian Plugin

## Coding Standards

1. NO EMOJIS anywhere in the codebase, UI, or documentation
2. MINIMAL COMMENTS - code should be self-documenting
3. Use TypeScript strict mode
4. Follow Obsidian plugin API conventions

## File Structure

```
ollama-obsidian/
├── src/
│   ├── main.ts
│   ├── settings.ts
│   ├── api/
│   │   └── ollama-client.ts
│   ├── parsers/
│   │   └── pdf-parser.ts
│   ├── ui/
│   │   ├── chat-popover.ts
│   │   ├── action-bar.ts
│   │   ├── inline-annotation.ts
│   │   └── focus-mode.ts
│   ├── features/
│   │   ├── fill-detector.ts
│   │   ├── code-actions.ts
│   │   └── conversation.ts
│   └── types/
│       └── index.ts
├── styles.css
├── manifest.json
├── package.json
└── tsconfig.json
```

## Core Components

1. OllamaClient - HTTP communication with Ollama server, streaming support
2. ChatPopover - Spacebar-triggered chat interface with PDF upload
3. ActionBar - Insert/Replace/Copy/Dismiss buttons
4. FillDetector - [FILL] pattern detection and replacement
5. PDFParser - PDF text extraction using pdfjs-dist
6. ConversationHistory - Session-based message storage
7. InlineAnnotation - Text selection floating menu
8. FocusMode - Distraction-free writing mode
9. CodeActions - Code block detection and actions
