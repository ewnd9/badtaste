import Message from './components/message';

export default (screen, message) => {
  const msg = Message(screen, ' {blue-fg}Info{/blue-fg}');
  msg.display(message, 1, function(err) {
    Logger.error(err);
  });
};
