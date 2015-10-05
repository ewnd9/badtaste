import _prompt from './../tui/prompt';
import Promise from 'bluebird';

let label = '{blue-fg}Question{/blue-fg}';

export let prompt = (screen, label, question) => {
  return new Promise((resolve, reject) => {
    _prompt(screen, question, question, (value) => {
      resolve(value);
    });
  });
};

export let urlPrompt = (screen, urlQuestion, nameQuestion) => {
  return prompt(screen, label, urlQuestion).then((url) => {
    return prompt(screen, label, nameQuestion).then((name) => {
      return {
        url,
        name
      };
    });
  });
};

export let vkSearchPrompt = (screen, cb) => {
  let question = 'Enter search query';
  return prompt(screen, label, question);
};
