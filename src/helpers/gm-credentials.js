import inquirer from 'inquirer-question';
import storage from './../storage';

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

export let hasData = () => {
  if (storage.data.googleEmail) {
    gmActions.setCredentials(storage.data.googleEmail, storage.data.googlePassword);
    return storage.data.googleEmail;
  } else {
    return false;
  }
};

export let getUser = () => storage.data.googleEmail;

export let dialog = () => {
  return inquirer.prompt([email, password]).then((credentials) => {
    storage.data.googleEmail = credentials.googleEmail;
    storage.data.googlePassword = credentials.googlePassword;
    storage.save();
  });
};
