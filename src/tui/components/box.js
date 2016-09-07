import blessed from 'blessed';

export const styles = {
  top: 'center',
  left: 'center',
  tags: true,
  border: {
    type: 'line'
  }
};

export default (screen, width, height, content) => blessed.box({
  ...styles,
  parent: screen,
  width: width,
  height: height,
  content: content
});
