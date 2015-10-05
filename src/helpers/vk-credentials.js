import * as vk from 'vk-universal-api';
import inquirer from 'inquirer-question';

import storage from './../storage';

let authUrl = 'https://oauth.vk.com/authorize?client_id=5075122&scope=audio,offline&redirect_uri=https://oauth.vk.com/blank.html&display=page&v=5.23&response_type=token';
let responseExample = 'https://oauth.vk.com/blank.html#access_token=<85 symbols>&expires_in=0&user_id=<user_id>';

let token = {
  name: 'url',
  type: 'input',
  message: `Open "${authUrl}" in browser.\nCopy paste new url here.\nIt should look "${responseExample}"`
};

let extractToken = (data) => {
  let tokenRegex = /.+access_token=([a-z0-9]+)&.+/g;
  let match = tokenRegex.exec(data);
  return match[1];
};

export let setupToken = (response) => {
  var token = extractToken(response);
  vk.setToken(token);
};

export let hasData = () => typeof storage.data.vkToken !== 'undefined';
export let init = () => hasData() ? setupToken(storage.data.vkToken) : undefined;
export let getUser = () => storage.data.vkUsername;

storage.vkHasData = hasData;

export let dialog = () => {
  return inquirer.prompt([token]).then((credentials) => {
    setupToken(credentials.url);

    return vk.method('users.get').then((user) => {
      storage.data.vkUsername = user.meta.first_name + ' ' + user.meta.last_name;
      storage.data.vkToken = credentials.url;

      storage.save();

      init();
    }).catch((err) => {
      console.log('wrong data');
    });
  });
};
