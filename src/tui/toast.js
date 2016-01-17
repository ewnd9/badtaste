import LoadingSpinner from './loading-spinner';

export default (screen, message) => {
	const spinner = LoadingSpinner(screen, message, true, '');
	setTimeout(() => spinner.stop(), 1000);
};
