# Ollama Obsidian Plugin

A powerful Obsidian plugin that integrates Ollama large language models directly into your note-taking workflow. Generate content, summarize PDFs, explain text, and interact with AI through an intuitive contextual interface.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Development](#development)
- [License](#license)

## Features

### Chat Popover

Press the spacebar on an empty new line to open a floating chat interface. The popover provides:

- Text input for prompts and questions
- PDF upload zone supporting multiple documents
- Model selector with auto-detection of available models
- Quick action buttons for common operations
- Real-time streaming responses

### Fill Pattern Detection

Insert `[FILL]` or `[FILL:n]` patterns in your notes to trigger automatic paragraph generation. The plugin analyzes surrounding context to produce relevant content.

- `[FILL]` generates a single paragraph
- `[FILL:3]` generates three paragraphs

### PDF Summarization

Upload one or multiple PDF documents directly into the chat popover. The plugin extracts text content and enables:

- Document summarization
- Question answering across multiple PDFs
- Key point extraction
- Content comparison between documents

### Inline Annotations

Select text to reveal a floating action menu with quick operations:

- Explain: Generate detailed explanations
- Expand: Add additional paragraphs
- Improve: Enhance writing quality
- Summarize: Create concise summaries

### Code Block Support

The plugin detects fenced code blocks and offers language-aware actions:

- Explain code functionality
- Add inline comments
- Convert to another programming language
- Identify potential issues

### Focus Mode

Enter a distraction-free writing environment with AI assistance. Focus mode provides:

- Full-screen editing interface
- Minimal UI elements
- Keyboard-driven AI interactions
- Centered content area for comfortable reading

### Action Bar

After content generation, an action bar appears with options:

- Insert Below: Add content after the current position
- Replace: Substitute selected text with generated content
- Copy: Copy content to clipboard
- Dismiss: Discard generated content
- New Note: Create a new note with the content

### Conversation History

The plugin maintains conversation context within each note session, enabling:

- Follow-up questions with context awareness
- Multi-turn conversations
- Session-based memory that clears on note close

## Requirements

- Obsidian v1.0.0 or higher
- Ollama installed and running locally
- At least one Ollama model downloaded

### Installing Ollama

1. Visit [ollama.ai](https://ollama.ai) and download the installer for your platform
2. Install and launch Ollama
3. Download a model: `ollama pull llama3` or any preferred model
4. Verify Ollama is running at `http://localhost:11434`

## Installation

### From Community Plugins

1. Open Obsidian Settings
2. Navigate to Community Plugins and disable Safe Mode
3. Click Browse and search for "Ollama"
4. Install the plugin and enable it

### Manual Installation

1. Download the latest release from the GitHub releases page
2. Extract `main.js`, `manifest.json`, and `styles.css` to your vault's `.obsidian/plugins/ollama-obsidian/` directory
3. Reload Obsidian
4. Enable the plugin in Community Plugins settings

## Usage

### Opening the Chat Popover

1. Place your cursor on an empty line
2. Press the spacebar
3. The chat popover appears near your cursor
4. Type your prompt or upload a PDF
5. Press Enter or click Send

### Using Fill Patterns

1. Type `[FILL]` where you want generated content
2. Execute the "Process Fill Patterns" command from the command palette
3. The plugin replaces the pattern with generated content

### Summarizing PDFs

1. Open the chat popover with spacebar
2. Drag and drop PDF files into the upload zone
3. Type a prompt such as "Summarize this document"
4. Review the streaming response
5. Choose an action from the action bar

### Using Inline Annotations

1. Select text in your note
2. A floating menu appears above the selection
3. Click the desired action
4. Review and apply the generated content

### Code Block Actions

1. Place your cursor inside a fenced code block
2. Open the command palette
3. Select from available code actions
4. Review and apply the result

### Entering Focus Mode

1. Use the command palette or configured hotkey
2. The editor enters full-screen mode
3. Use keyboard shortcuts for AI assistance
4. Press Escape to exit focus mode

## Configuration

Access plugin settings through Obsidian Settings > Ollama.

| Setting | Description | Default |
|---------|-------------|---------|
| Ollama URL | Server address for Ollama instance | `http://localhost:11434` |
| Default Model | Preferred model for generation | Auto-detected |
| Temperature | Controls randomness of output (0.0-1.0) | `0.7` |
| Max Tokens | Maximum length of generated content | `2048` |
| Context Lines | Lines of context for fill patterns | `10` |
| Streaming | Enable real-time response streaming | `true` |
| Focus Mode Hotkey | Keyboard shortcut for focus mode | `Ctrl+Shift+F` |

## Development

### Building from Source

```bash
git clone https://github.com/your-username/ollama-obsidian.git
cd ollama-obsidian
npm install
npm run build
```

### Development Mode

```bash
npm run dev
```

### Project Structure

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

## License

MIT License. See [LICENSE](LICENSE) for details.
