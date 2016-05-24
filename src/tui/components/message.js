import blessed from 'blessed';

export const stylesheet = {
  border: 'line',
  height: 'shrink',
  width: 'half',
  top: 'center',
  left: 'center',
  tags: true,
  keys: true,
  hidden: true,
  vi: true
};

export default (parent, label) => blessed.message({
  parent,
  ...stylesheet,
  label
});
