import React from 'react';

import { style } from '../../tui/components/prompt';
import { connect } from 'react-redux';

import { styles as boxStyles } from '../../tui/components/box';
import { styles as textboxStyles } from '../../tui/components/textbox';

export const Prompt = React.createClass({
  setPrompt(prompt) {
    const { question, onComplete } = this.props;

    prompt.input(question, '', (err, value) => {
      onComplete(value);
    });
  },
  render() {
    const { label } = this.props;

    return (
      <prompt
        label={label}
        ref={this.setPrompt}
        {...style} />
    );
  }
});

export const NextPromptRedux = (label, question, action) => {
  const mapDispatchToProps = { action };

  const NextPromptRedux = React.createClass({
    render() {
      const { action } = this.props;

      return (
        <Prompt
          label={label}
          question={question}
          onComplete={action} />
      );
    }
  });

  return connect(null, mapDispatchToProps)(NextPromptRedux);
};

export const MultilinePrompt = React.createClass({
  setTextbox(textbox) {
    this.textbox = textbox;

    if (!textbox) {
      return;
    }

    const { onComplete } = this.props;

    this.textbox.on('action', () => {
      // layout.hide();
      // input.cancel();
      // screen.render();
    });

    this.textbox.on('submit', onComplete);
    this.textbox.on('cancel', onComplete);
    this.textbox.focus();

    // const { screen } = this.props;
    //
    // input.focus();
    //
    // screen.saveFocus();
    // screen.render();
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.lines !== nextProps.lines) {
      if (this.textbox) {
        this.textbox.focus();
        this.textbox.setValue('');
      }
    }
  },
  render() {
    const { lines } = this.props;

    return (
      <box
        {...boxStyles}
        width="70%"
        height={4 + lines.length}
        content={lines.join('\n')}>

        <textbox
          {...textboxStyles}
          ref={this.setTextbox}
          top={lines.length + 1}
          height={1} />

      </box>
    );
  }
});

export const UrlPrompt = React.createClass({
  getInitialState() {
    return { state: 'url' };
  },
  onComplete(value) {
    const { onComplete } = this.props;
    const { state, url } = this.state;

    if (state === 'url') {
      this.setState({
        state: 'name',
        url: value
      });
    } else {
      onComplete({
        url,
        name: value
      });
    }
  },
  render() {
    const { label, urlQuestion, nameQuestion } = this.props;
    const { state } = this.state;

    if (state === 'url') {
      return (
        <MultilinePrompt
          label={label}
          lines={urlQuestion}
          onComplete={this.onComplete} />
      );
    } else {
      return (
        <MultilinePrompt
          label={label}
          lines={nameQuestion}
          onComplete={this.onComplete} />
      );
    }
  }
});
