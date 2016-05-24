import blessed from 'blessed';

export const stylesheet = {
  type: 'line',
  orientation: 'horizontal',
  top: 0,
  left: 0,
  style: {
    fg: 'green'
  }
};

export default (parent, params) => blessed.line({
  parent,
  ...stylesheet,
  ...params
});
