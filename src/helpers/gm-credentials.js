import inquirer from 'inquirer-question';
import storage from './../storage';
import Promise from 'bluebird';

import * as gmActions from './../actions/gm-actions';

let email = {
  name: 'googleEmail',
  message: 'google email',
  type: 'input'
};

let password = {
  name: 'googlePassword',
  message: 'google password (use google\'s one time passwords generator https://security.google.com/settings/security/apppasswords?pli=1)',
  type: 'input'
};

export let hasData = () => typeof storage.data.googleToken !== 'undefined';
export let init = () => hasData() ? gmActions.setCredentials(storage.data.googleToken) : Promise.resolve(true);
export let getUser = () => storage.data.googleEmail;

storage.gmHasData = hasData;

export let dialog = () => {
  return inquirer.prompt([email, password]).then((credentials) => {
    storage.data.googleEmail = credentials.googleEmail;

    return gmActions.getToken({
      email: credentials.googleEmail,
      password: credentials.googlePassword
    });
  }).then((token) => {
    storage.data.googleToken = token;
    storage.save();

    init();
  });
};
