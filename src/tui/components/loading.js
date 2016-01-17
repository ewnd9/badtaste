import blessed from 'blessed';

export default (screen, label) => blessed.loading({
	parent: screen,
	border: 'line',
	height: 'shrink',
	width: 'half',
	top: 'center',
	left: 'center',
	label: label,
	tags: true,
	keys: true,
	hidden: true,
	vi: true
});
