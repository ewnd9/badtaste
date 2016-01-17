import blessed from 'blessed';

export default (parent, params) => blessed.list({
	parent: parent,
  top: 1,
  bottom: 1,
  tags: true,
  padding: {
    left: 1,
    right: 1
  },
  input: true,
  scrollable: true,
  keys: true,
  vi: true,
  mouse: true,
  alwaysScroll: true,
  scrollbar: {
    ch: ' ',
    inverse: true,
    fg: 'red'
  },
  style: {
    selected: {
      fg: 'grey',
      bg: 'white'
    }
  },
	...params
});
