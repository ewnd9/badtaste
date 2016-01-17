import blessed from 'blessed';

export default (parent, top, height) => blessed.textbox({
	parent: parent,
	top: top,
	height: height,
	left: 2,
	right: 2,
	bg: 'black',
	inputOnFocus: true,
	tags: true,
	keys: true,
	vi: true,
	hidden: false
});
