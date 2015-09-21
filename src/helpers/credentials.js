import * as vk from 'vk-universal-api';
import inquirerCredentials from 'inquirer-credentials';

let authUrl = 'https://oauth.vk.com/authorize?client_id=5075122&scope=audio,offline&redirect_uri=https://oauth.vk.com/blank.html&display=page&v=5.23&response_type=token';
let responseExample = 'https://oauth.vk.com/blank.html#access_token=<85 symbols>&expires_in=0&user_id=<user_id>';

let token = {
  name: 'url',
  type: 'input',
  hint: `Open "${authUrl}" in browser.\nCopy paste new url here.\nIt should look "${responseExample}"`,
  env: 'VK_TOKEN'
};

let tokenRegex = /.+access_token=([a-z0-9]+)&.+/g;

export default () => {
  return inquirerCredentials('.badtaste-npm-credentials', [token]).then(function(credentials) {
    var match = tokenRegex.exec(credentials.url);

    var token = match[1];
    vk.setToken(token);
  });
};
