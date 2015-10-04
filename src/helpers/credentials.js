import vkCredentials from './vk-credentials';
import gmCredentials from './gm-credentials';

export default () => {
	return vkCredentials().then(gmCredentials);
};
