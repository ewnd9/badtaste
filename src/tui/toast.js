import LoadingSpinner from './loading-spinner';

export default (screen, message) => {
	let spinner = LoadingSpinner(screen, message, true, '');
	setTimeout(() => spinner.stop(), 1000);
};
