var spawn = require('child_process').spawn;
var onNextSong = () => Logger.info('no next song');

let createProcess = (url) => {
  var ls = spawn('node', [__dirname + '/player.js']);

  ls.stdin.write(url);

  ls.stdout.on('data', function (data) {
    // Logger.info('stdout: ' + data);
  });

  ls.stderr.on('data', function (data) {
    data = data.toString();
    if (data.trim() === 'No next song was found') {
      onNextSong();
    } else {
      Logger.error(data.substr(0, 100));
    }
  });

  ls.on('close', function (code) {
    // Logger.error('child process exited with code ' + code + ' ' + i++);
  });

  return ls;
};

var x = {

};

let killPlayer = () => {
  if (x.p) {
    x.p.stdin.pause();
    x.p.kill('SIGTERM');
  }
};

import exitHook from 'exit-hook';

exitHook(() => {
  killPlayer();
});

export let play = (url) => {
  killPlayer();

  setTimeout(() => {
    x.p = createProcess(url);
  }, 10);
};

export let stop = (url) => {
  killPlayer();
};

export let setOnNextSong = (callback) => onNextSong = callback;
