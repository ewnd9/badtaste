import Promise from 'bluebird';
import menu from 'inquirer-menu';

import * as vkCredentials from './vk-credentials';
import * as gmCredentials from './gm-credentials';

export default force => {
  const createMenu = () => {
    const result = {
      message: 'Setup login credentials',
      choices: {}
    };

    result.choices[`vk${vkCredentials.hasData() ? ` (${vkCredentials.getUser()})`: ''}`] = vkCredentials.dialog;
    result.choices['google music' + (gmCredentials.hasData() ? ' (' + gmCredentials.getUser() + ')' : '')] = gmCredentials.dialog;
    result.choices['continue'] = () => Promise.resolve(true);

    return result;
  };

  return gmCredentials.init()
    .then(() => {
      vkCredentials.init();

      if (!force && (vkCredentials.hasData() || gmCredentials.hasData())) {
        return Promise.resolve(true);
      } else {
        return menu(createMenu);
      }
    });
};
