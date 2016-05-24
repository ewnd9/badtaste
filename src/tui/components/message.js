import blessed from 'blessed';

export default (parent, label) => blessed.message({
	parent: parent,
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
