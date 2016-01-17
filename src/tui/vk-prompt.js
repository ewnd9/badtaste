import blessed from 'blessed';
import * as vk from 'vk-universal-api';

export default (screen, cb) => {
  const prompt = blessed.prompt({
    parent: screen,
    border: 'line',
    height: 'shrink',
    width: 'half',
    top: 'center',
    left: 'center',
    label: ' {blue-fg}Question{/blue-fg} ',
    tags: true,
    keys: true,
    vi: true,
    hidden: false
  });

  prompt.input('insert vk user or community url', '', (err, value) => {
    const alias = value.split('vk.com/')[1];
    return vk.method('utils.resolveScreenName', { screen_name: alias }).then((apiResponse) => {
      const id = (apiResponse.type === 'group' ? '-' : '') + apiResponse.object_id;
      cb(id);
    }).catch(Logger.error.bind(Logger));
  });
};
