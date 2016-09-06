import React from 'react';
import { listStylesheet } from '../../tui/components/list';

const style = {
  ...listStylesheet,
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  border: {
    type: 'line'
  }
};

export default React.createClass({
  componentWillMount() {
    const { screen } = this.props;
    screen.saveFocus();
    screen.blockEsc = true;
  },
  keepFocus() {
    this.list.focus();
  },
  complete(index) {
    const { screen, onComplete } = this.props;

    this.list.removeListener('blur', this.keepFocus);
    this.list.removeScreenEvent('keypress', this.onPress);

    screen.restoreFocus();
    screen.render();

    setTimeout(() => screen.blockEsc = false, 1000);

    onComplete(index);
  },
  onPress(ch, key) {
    if (key.name === 'escape') {
      this.complete();
    }
  },
  setList(list) {
    if (!list) {
      return;
    }

    Logger.info(typeof list, 'asd');
    this.list = list;
    this.list.focus();
    this.list.on('blur', this.keepFocus);
    this.list.onScreenEvent('keypress', this.onPress);
    this.list.on('select', (item, index) => {
      this.complete(index);
    });
  },
  render() {
    const { items } = this.props;

    return (
      <list
        {...style}
        items={items}
        ref={this.setList} />
    );
  }
});
