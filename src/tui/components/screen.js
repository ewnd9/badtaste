import blessed from 'blessed';

export default () => blessed.screen({
	smartCSR: true,
	debug: true
});
