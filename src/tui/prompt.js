import Prompt from './components/prompt';

export default (screen, label, question, cb) => {
  const prompt = Prompt(screen, label);
  prompt.input(question, '', (err, value) => {
    cb(value);
  });
};
