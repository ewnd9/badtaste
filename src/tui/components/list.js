import blessed from 'blessed';

export const listStylesheet = {
  tags: true,
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

export const stylesheet = {
  ...listStylesheet,
  top: 1,
  bottom: 1,
  padding: {
    left: 1,
    right: 1
  }
};

export default (parent, params) => blessed.list({
  parent,
  ...stylesheet,
  ...params
});
