import blessed from 'blessed';

export default (parent, params) => blessed.line({
	...params,
	parent: parent,
	type: 'line',
	orientation: 'horizontal',
	top: 0,
	style: {
		fg: 'green'
	}
});
