import SelectList from './../select-list';

export function nameWithCount(name, xs) {
  return name + (xs.length > 0 ? ` (${xs.length})` : '');
}

export function selectOrSearch(screen, labels, onLabel, onSearch) {
  return SelectList(screen, ['> Search'].concat(labels))
    .then(index => {
      if (index === 0) {
        onSearch();
      } else {
        onLabel(index - 1);
      }
    }, () => Logger.info('SelectList closed by esc'));
}
