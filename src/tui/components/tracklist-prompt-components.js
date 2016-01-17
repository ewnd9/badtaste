import blessed from 'blessed';

export const Layout = screen => blessed.box({
	parent: screen,
	top: 'center',
	left: 'center',
	width: '50%',
	height: '50%',
	tags: true,
	border: {
		type: 'line'
	}
});

export const TextArea = () => blessed.textarea({
	inputOnFocus: true,
	style: {
		bg: 'black'
	},
	keys: true,
	height: '100%-6'
});

export const Text = () => blessed.text({
	content: 'Paste tracklist, press esc.\nUnfortunately there is large input lag before text is actually pasted in form, don\'t close it',
	top: '100%-6',
	align: 'middle'
});
