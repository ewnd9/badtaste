import blessed from 'blessed';

import { LeftPane } from './components/lists-components';
import Line from './components/line';

export default (parent) => {
  const box = LeftPane(parent);
  const line = Line(parent, { left: 1, width: '30%-3' });

  return {
    box,
    line
  };
};
