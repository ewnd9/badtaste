import blessed from 'blessed';
import style from './style';

export default (parent) => {
  let box = blessed.list({
    ...style,
    left: '30%',
    width: '70%',
    items: ['Hello {bold}world{/bold}!']
  });

  parent.append(box);
  return box;
};
