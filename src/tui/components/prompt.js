import blessed from 'blessed';

export default (screen, label) => blessed.prompt({
	parent: screen,
	border: 'line',
	height: 'shrink',
	width: 'half',
	top: 'center',
	left: 'center',
	label: label,
	tags: true,
	keys: true,
	vi: true,
	hidden: false
});
