import React from 'react';
import { style } from '../../tui/components/prompt';
import { connect } from 'react-redux';

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
