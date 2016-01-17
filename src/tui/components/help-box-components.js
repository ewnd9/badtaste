import blessed from 'blessed';

export const HelpBox = screen => blessed.message({
	parent: screen,
	border: 'line',
	height: 'shrink',
	width: 'half',
	top: 'center',
	left: 'center',
	label: ' {blue-fg}Help{/blue-fg}',
	tags: true,
	keys: true,
	hidden: true,
	vi: true
});
