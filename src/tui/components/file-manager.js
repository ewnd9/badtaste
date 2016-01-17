import blessed from 'blessed';

export default () => blessed.filemanager({
	border: 'line',
	style: {
		selected: {
			bg: 'blue'
		}
	},
	height: '100%-3',
	label: ' {blue-fg}%path{/blue-fg} ',
	cwd: process.env.HOME,
	keys: true,
	vi: true,
	scrollbar: {
		bg: 'white',
		ch: ' '
	}
});
