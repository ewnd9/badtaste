import * as vk from 'vk-universal-api';
import _prompt from './../tui/prompt';
import Promise from 'bluebird';

export let prompt = (screen, label, question) => {
  return new Promise((resolve, reject) => {
    _prompt(screen, label, question, (value) => {
      resolve(value);
    });
  });
};

let label = '{blue-fg}Question{/blue-fg}';

export let vkUrlPrompt = (screen) => {
  let question = 'Enter vk user or community url';

  return prompt(screen, label, question).then((value) => {
    var alias = value.split('vk.com/')[1];
    Logger.info(alias);
    return vk.method('utils.resolveScreenName', { screen_name: alias });
  }).then((apiResponse) => {
    var id = (apiResponse.type === 'group' ? '-' : '') + apiResponse.object_id;
    return prompt(screen, label, 'Enter name for left menu').then((name) => {
      return {
        id: id,
        name: name
      };
    });
  }).catch((err) => {
    Logger.error(err);
    throw err;
  });
};

export let vkSearchPrompt = (screen, cb) => {
  let question = 'Enter search query';
  return prompt(screen, label, question);
};
