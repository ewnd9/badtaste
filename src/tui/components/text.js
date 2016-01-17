import blessed from 'blessed';

export default (content, top) => blessed.text({
	content: content,
	top: top,
	align: 'middle'
});
