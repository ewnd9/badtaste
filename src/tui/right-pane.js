import blessed from 'blessed';
import style from './list-style';

export default (parent) => {
  let box = blessed.list({
    ...style,
    left: '30%',
    width: '70%',
    items: ['{bold}Loading{/bold}, please wait']
  });

  let line = blessed.line({
    parent: parent,
    type: 'line',
    orientation: 'horizontal',
    left: '30%+1',
    width: '70%-3',
    top: 0,
    style: {
      fg: 'green'
    }
  });

  parent.append(box);

  return {
    box,
    line
  };
};
