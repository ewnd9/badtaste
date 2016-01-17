import _prompt from './../tui/prompt';
import Promise from 'bluebird';
import blessed from 'blessed';
import { Layout, TextBox } from './components/vk-prompts-components';

const label = '{blue-fg}Question{/blue-fg}';

export const prompt = (screen, label, question) => {
  return new Promise((resolve, reject) => {
    _prompt(screen, question, question, (value) => {
      resolve(value);
    });
  });
};

export const customPrompt = (screen, lines) => {
  const layout = Layout(screen, lines);
  const input = TextBox(layout);

  input.focus();

  screen.saveFocus();
  screen.render();

  return new Promise((resolve, reject) => {
    input.on('action', () => {
      layout.hide();
      input.cancel();

      screen.render();
    });
    input.on('submit', (data) => resolve(data));
    input.on('cancel', () => reject());
  });
};

export const urlPrompt = (screen, urlQuestion, nameQuestion) => {
  const result = {};

  return customPrompt(screen, urlQuestion).then((url) => {
    result.url = url;
    return customPrompt(screen, [nameQuestion]);
  }).then((name) => {
    result.name = name;
    return result;
  });
};

export const vkSearchPrompt = (screen, cb) => {
  const question = 'Enter search query';
  return prompt(screen, label, question);
};
