import SelectList from './../select-list';

export const nameWithCount = (name, xs) => name + (xs.length > 0 ? ` (${xs.length})` : '');

export const selectOrSearch = (screen, labels, onLabel, onSearch) => {
  SelectList(screen, ['> Search'].concat(labels)).then((index) => {
    if (index === 0) {
      onSearch();
    } else {
      onLabel(index - 1);
    }
  }, () => console.log('SelectList closed by esc'));
};
