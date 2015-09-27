import blessed from 'blessed';
import Promise from 'bluebird';

export default (screen) => {
  let layout = blessed.box({
    parent: screen,
    top: 'center',
    left: 'center',
    width: '90%',
    height: '90%',
    tags: true,
    border: {
      type: 'line'
    }
  });

  let fm = blessed.filemanager({
		border: 'line',
		style: {
			selected: {
				bg: 'blue'
			}
		},
		height: '100%-3',
		label: ' {blue-fg}%path{/blue-fg} ',
		cwd: process.env.HOME,
		keys: true,
		vi: true,
		scrollbar: {
			bg: 'white',
			ch: ' '
		}
	});

  let text = blessed.text({
    content: 'Press "s" to play directory',
    top: '100%-3',
    align: 'middle'
  });

  layout.append(fm);
  layout.append(text);

  return new Promise((resolve, reject) => {
    let lastCd = process.env.HOME;

    fm.on('cd', (file) => {
      lastCd = file;
    });

    fm.refresh();
    fm.focus();

    screen.key(['s'], function(ch, key) {
      layout.destroy();

      let content = fm.items[fm.selected].content;
      let escaped = content.replace(/\{[^{}]+\}/g, '').replace(/@$/, '');
      let result = lastCd + '/' + escaped;

      return resolve(result);
    });
  });
};
