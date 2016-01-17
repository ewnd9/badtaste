import blessed from 'blessed';

export const Layout = (screen, lines) => blessed.box({
	parent: screen,
	top: 'center',
	left: 'center',
	width: '70%',
	height: 4 + lines.length,
	tags: true,
	mouse: true,
	content: lines.join('\n'),
	border: {
		type: 'line'
	},
	keys: true,
	vi: true,
	hidden: false
});

export const TextBox = layout => blessed.textbox({
	parent: layout,
	top: lines.length + 1,
	height: 1,
	left: 2,
	right: 2,
	bg: 'black',
	inputOnFocus: true,
	tags: true,
	keys: true,
	vi: true,
	hidden: false
});
