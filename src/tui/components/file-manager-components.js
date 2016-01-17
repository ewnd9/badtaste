import blessed from 'blessed';

export const Layout = screen => blessed.box({
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

export const FileManager = () => blessed.filemanager({
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

export const Text = () => blessed.text({
	content: 'Press "s" to play directory',
	top: '100%-3',
	align: 'middle'
});
