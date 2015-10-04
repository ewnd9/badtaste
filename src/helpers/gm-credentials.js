import inquirerCredentials from 'inquirer-credentials';
import storage from './../storage';

let email = {
  name: 'google-email',
  type: 'input',
  env: 'GOOGLE_EMAIL'
};

let password = {
  name: 'google-password',
  type: 'input',
  env: 'GOOGLE_PASSWORD'
};

export default () => {
  return inquirerCredentials('.badtaste-npm-credentials', [email, password]).then((credentials) => {
		storage.googleEmail = credentials[email.name];
		storage.googlePassword = credentials[password.name];
  });
};
