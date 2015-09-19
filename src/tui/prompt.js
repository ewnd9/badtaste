import blessed from 'blessed';

export default (screen, label, question, cb) => {
  let prompt = blessed.prompt({
    parent: screen,
    border: 'line',
    height: 'shrink',
    width: 'half',
    top: 'center',
    left: 'center',
    label: label,
    tags: true,
    keys: true,
    vi: true,
    hidden: false
  });

  prompt.input(question, '', (err, value) => {
    cb(value);
  });
};
