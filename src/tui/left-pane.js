import blessed from 'blessed';
import style from './style';

export default (parent) => {
  let box = blessed.list({
    ...style,
    left: 0,
    width: '30%',
    items: ['{bold}VK{/bold} audio', 'Add more...']
  });

  parent.append(box);
  return box;
};
