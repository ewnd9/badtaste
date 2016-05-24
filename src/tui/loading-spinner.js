import Loading from './components/loading';

export default (screen, message, lockKeys = true, label = ' {blue-fg}Loading{/blue-fg} ') => {
  const loader = Loading(screen, label);
  loader.load(message);

  screen.lockKeys = lockKeys;
  screen.key(['z'], () => loader.stop());

  const superStop = loader.stop;
  loader.stop = () => {
    superStop.call(loader);
    screen.removeKey(['z'], () => loader.stop());
  };

  return loader;
};
