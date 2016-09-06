import blessed from 'blessed';

export const style = {
  border: 'line',
  height: 'shrink',
  width: 'half',
  top: 'center',
  left: 'center',
  tags: true,
  keys: true,
  vi: true,
  hidden: false
};

export default (screen, label) => blessed.prompt({
	label,
  parent: screen,
  ...style
});
