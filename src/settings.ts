import { App, PluginSettingTab, Setting } from 'obsidian';
import { OllamaSettings, DEFAULT_SETTINGS } from './types';
import OllamaPlugin from './main';

export class OllamaSettingTab extends PluginSettingTab {
    plugin: OllamaPlugin;

    constructor(app: App, plugin: OllamaPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Ollama Settings' });

        new Setting(containerEl)
            .setName('Ollama URL')
            .setDesc('The URL of your Ollama server')
            .addText((text) => text
                .setPlaceholder('http://localhost:11434')
                .setValue(this.plugin.settings.ollamaUrl)
                .onChange(async (value) => {
                    this.plugin.settings.ollamaUrl = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Default Model')
            .setDesc('The default model to use for generation')
            .addDropdown(async (dropdown) => {
                dropdown.addOption('', 'Auto-detect');
                try {
                    const models = await this.plugin.ollamaClient.fetchModels();
                    for (const model of models) {
                        dropdown.addOption(model.name, model.name);
                    }
                } catch {
                    dropdown.addOption('', 'Failed to fetch models');
                }
                dropdown.setValue(this.plugin.settings.defaultModel);
                dropdown.onChange(async (value) => {
                    this.plugin.settings.defaultModel = value;
                    await this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName('Temperature')
            .setDesc('Controls randomness of output (0.0 - 1.0)')
            .addSlider((slider) => slider
                .setLimits(0, 1, 0.1)
                .setValue(this.plugin.settings.temperature)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.temperature = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Max Tokens')
            .setDesc('Maximum length of generated content')
            .addText((text) => text
                .setPlaceholder('2048')
                .setValue(String(this.plugin.settings.maxTokens))
                .onChange(async (value) => {
                    const num = parseInt(value, 10);
                    if (!isNaN(num) && num > 0) {
                        this.plugin.settings.maxTokens = num;
                        await this.plugin.saveSettings();
                    }
                }));

        new Setting(containerEl)
            .setName('Context Lines')
            .setDesc('Number of lines to use as context for [FILL] patterns')
            .addText((text) => text
                .setPlaceholder('10')
                .setValue(String(this.plugin.settings.contextLines))
                .onChange(async (value) => {
                    const num = parseInt(value, 10);
                    if (!isNaN(num) && num > 0) {
                        this.plugin.settings.contextLines = num;
                        await this.plugin.saveSettings();
                    }
                }));

        new Setting(containerEl)
            .setName('Enable Streaming')
            .setDesc('Show text as it generates in real-time')
            .addToggle((toggle) => toggle
                .setValue(this.plugin.settings.streamingEnabled)
                .onChange(async (value) => {
                    this.plugin.settings.streamingEnabled = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Focus Mode Hotkey')
            .setDesc('Keyboard shortcut to enter focus mode')
            .addText((text) => text
                .setPlaceholder('Ctrl+Shift+F')
                .setValue(this.plugin.settings.focusModeHotkey)
                .onChange(async (value) => {
                    this.plugin.settings.focusModeHotkey = value;
                    await this.plugin.saveSettings();
                }));

        containerEl.createEl('h3', { text: 'Quick Actions' });

        this.plugin.settings.quickActions.forEach((action, index) => {
            new Setting(containerEl)
                .setName(action.label)
                .setDesc(action.prompt.substring(0, 50) + '...')
                .addButton((button) => button
                    .setButtonText('Remove')
                    .onClick(async () => {
                        this.plugin.settings.quickActions.splice(index, 1);
                        await this.plugin.saveSettings();
                        this.display();
                    }));
        });

        new Setting(containerEl)
            .setName('Add Quick Action')
            .addButton((button) => button
                .setButtonText('Add')
                .onClick(async () => {
                    this.plugin.settings.quickActions.push({
                        label: 'New Action',
                        prompt: 'Enter your prompt here'
                    });
                    await this.plugin.saveSettings();
                    this.display();
                }));
    }
}
