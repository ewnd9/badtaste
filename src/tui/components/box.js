import blessed from 'blessed';

export default (screen, width, height, content) => blessed.box({
  parent: screen,
	top: 'center',
  left: 'center',
  width: width,
  height: height,
  tags: true,
  content: content,
  border: {
    type: 'line'
  }
});
