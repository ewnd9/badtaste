import _prompt from './../tui/prompt';
import Promise from 'bluebird';
import blessed from 'blessed';

let label = '{blue-fg}Question{/blue-fg}';

export let prompt = (screen, label, question) => {
  return new Promise((resolve, reject) => {
    _prompt(screen, question, question, (value) => {
      resolve(value);
    });
  });
};

export let customPrompt = (screen, lines) => {
  let layout = blessed.box({
    parent: screen,
    top: 'center',
    left: 'center',
    width: '70%',
    height: 4 + lines.length,
    tags: true,
    mouse: true,
    content: lines.join('\n'),
    border: {
      type: 'line'
    },
    keys: true,
    vi: true,
    hidden: false
  });

  let input = blessed.textbox({
    parent: layout,
    top: lines.length + 1,
    height: 1,
    left: 2,
    right: 2,
    bg: 'black',
    inputOnFocus: true,
    tags: true,
    keys: true,
    vi: true,
    hidden: false
  });

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

export let urlPrompt = (screen, urlQuestion, nameQuestion) => {
  let result = {};

  return customPrompt(screen, urlQuestion).then((url) => {
    result.url = url;
    return customPrompt(screen, [nameQuestion]);
  }).then((name) => {
    result.name = name;
    return result;
  });
};

export let vkSearchPrompt = (screen, cb) => {
  let question = 'Enter search query';
  return prompt(screen, label, question);
};
