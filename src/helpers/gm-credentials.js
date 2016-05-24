import inquirer from 'inquirer-question';
import Promise from 'bluebird';

import storage from '../storage';
import * as gmActions from '../api/gm-api';

const email = {
  name: 'googleEmail',
  message: 'google email',
  type: 'input'
};

const password = {
  name: 'googlePassword',
  message: 'google password (use google\'s one time passwords generator https://security.google.com/settings/security/apppasswords?pli=1)',
  type: 'input'
};

export const hasData = () => typeof storage.data.googleToken !== 'undefined';
export const init = () => hasData() ? gmActions.setCredentials(storage.data.googleToken) : Promise.resolve(true);
export const getUser = () => storage.data.googleEmail;

storage.gmHasData = hasData;

export const dialog = () => {
  return inquirer
    .prompt([email, password])
    .then(credentials => {
      storage.data.googleEmail = credentials.googleEmail;

      return gmActions.getToken({
        email: credentials.googleEmail,
        password: credentials.googlePassword
      });
    })
    .then(token => {
      storage.data.googleToken = token;
      storage.save();

      init();
    });
};
