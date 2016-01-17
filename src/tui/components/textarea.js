import blessed from 'blessed';

export default () => blessed.textarea({
	inputOnFocus: true,
	style: {
		bg: 'black'
	},
	keys: true,
	height: '100%-6'
});
