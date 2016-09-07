import blessed from 'blessed';

export const styles = {
	left: 2,
  right: 2,
  bg: 'black',
  inputOnFocus: true,
  tags: true,
  keys: true,
  vi: true,
  hidden: false
};

export default (parent, top, height) => blessed.textbox({
  parent: parent,
  top: top,
  height: height,
	...styles
});
