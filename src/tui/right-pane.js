import blessed from 'blessed';

import { RightPane } from './components/lists-components';
import Line from './components/line';

export default (parent) => {
  const box = RightPane(parent);
  const line = Line(parent, { left: '30%+1', width: '70%-3' });

  return {
    box,
    line
  };
};
