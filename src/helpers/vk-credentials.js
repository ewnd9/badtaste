import inquirer from 'inquirer-question';

import * as vkActions from '../api/vk-api';
import storage from './../storage';

const authUrl = 'https://oauth.vk.com/authorize?client_id=5075122&scope=audio,offline&redirect_uri=https://oauth.vk.com/blank.html&display=page&v=5.23&response_type=token';
const responseExample = 'https://oauth.vk.com/blank.html#access_token=<85 symbols>&expires_in=0&user_id=<user_id>';

const token = {
  name: 'url',
  type: 'input',
  message: `Open "${authUrl}" in browser.\nCopy paste new url here.\nIt should look "${responseExample}"`
};

const extractToken = data => {
  const tokenRegex = /.+access_token=([a-z0-9]+)&.+/g;
  const match = tokenRegex.exec(data);
  return match[1];
};

export const setupToken = response => {
  const token = extractToken(response);
  vkActions.setToken(token);
};

export const hasData = () => typeof storage.data.vkToken !== 'undefined';
export const init = () => hasData() ? setupToken(storage.data.vkToken) : undefined;
export const getUser = () => storage.data.vkUsername;

storage.vkHasData = hasData;

export const dialog = () => {
  return inquirer
    .prompt([token])
    .then(credentials => {
      setupToken(credentials.url);

      return vkActions
        .getUserInfo()
        .then(user => {
          storage.data.vkUsername = `${user.meta.first_name} ${user.meta.last_name}`;
          storage.data.vkToken = credentials.url;

          storage.save();

          init();
        })
        .catch(err => {
          Logger.error('wrong data', err);
        });
  });
};
