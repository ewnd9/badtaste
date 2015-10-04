import * as vkCredentials from './vk-credentials';
import * as gmCredentials from './gm-credentials';

import menu from 'inquirer-menu';
import Promise from 'bluebird';

export default (force) => {
	var createMenu = () => {
		var result = {
			message: 'Setup login credentials',
			choices: {}
		};

		result.choices['vk' + (vkCredentials.hasData() ? ' (' + vkCredentials.getUser() + ')': '')] = vkCredentials.dialog;
		result.choices['google music' + (gmCredentials.hasData() ? ' (' + gmCredentials.getUser() + ')' : '')] = gmCredentials.dialog;

		return result;
	};

	if (!force && (vkCredentials.hasData() || gmCredentials.hasData())) {
		return Promise.resolve(true);
	} else {
		return menu(createMenu);
	}
};
