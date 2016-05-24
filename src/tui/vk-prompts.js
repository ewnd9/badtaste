import _prompt from './prompt';
import Promise from 'bluebird';

import Box from './components/box';
import TextBox from './components/textbox';

const label = '{blue-fg}Question{/blue-fg}';

export const prompt = (screen, label, question) => {
  return new Promise(resolve => {
    _prompt(screen, question, question, resolve);
  });
};

export const customPrompt = (screen, lines) => {
  const layout = Box(screen, '70%', 4 + lines.length, lines.join('\n'));
  const input = TextBox(layout, lines.length + 1, 1);

  input.focus();

  screen.saveFocus();
  screen.render();

  return new Promise((resolve, reject) => {
    input.on('action', () => {
      layout.hide();
      input.cancel();

      screen.render();
    });
    input.on('submit', resolve);
    input.on('cancel', reject);
  });
};

export const urlPrompt = (screen, urlQuestion, nameQuestion) => {
  const result = {};

  return customPrompt(screen, urlQuestion)
    .then(url => {
      result.url = url;
      return customPrompt(screen, [nameQuestion]);
    })
    .then(name => {
      result.name = name;
      return result;
    });
};

export const vkSearchPrompt = screen => {
  const question = 'Enter search query';
  return prompt(screen, label, question);
};
