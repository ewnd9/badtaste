import * as vk from 'vk-universal-api';
import prompt from './../tui/prompt';

export let vkUrlPrompt = (screen, cb) => {
  let label = '{blue-fg}Question{/blue-fg}';
  let question = 'Enter vk user or community url';

  prompt(screen, label, question, (value) => {
    var alias = value.split('vk.com/')[1];
    return vk.method('utils.resolveScreenName', { screen_name: alias }).then((apiResponse) => {
      var id = (apiResponse.type === 'group' ? '-' : '') + apiResponse.object_id;
      cb(id);
    }).catch(console.log.bind(console));
  });
};

export let vkSearchPrompt = (screen, cb) => {
  let label = '{blue-fg}Question{/blue-fg}';
  let question = 'Enter search query';

  prompt(screen, label, question, (value) => {
    cb(value);
  });
};
