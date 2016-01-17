import blessed from 'blessed';

const basicList = {
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
  }
};

export const LeftPane = parent => blessed.list({
	...basicList,
  parent: parent,
	left: 0,
	width: '30%',
	items: ['Loading']
});

export const RightPane = parent => blessed.list({
	...basicList,
  parent: parent,
	left: '30%',
	width: '70%',
	items: ['{bold}Loading{/bold}, please wait']
});

export const SelectList = () => blessed.list({
	...basicList,
	top: 'center',
	left: 'center',
	width: '50%',
	height: '50%',
	border: {
		type: 'line'
	}
});
