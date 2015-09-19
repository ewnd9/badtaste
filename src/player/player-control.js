var spawn = require('child_process').spawn;
var i = 0;
var onNextSong = () => console.log('no next song');

let createProcess = (url) => {
  var ls = spawn('node', [__dirname + '/player.js']);

  ls.stdin.write(url);

  ls.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  ls.stderr.on('data', function (data) {
    if (data.toString().trim() === 'No next song was found') {
      onNextSong();
    } else {
      console.log('error', data);
    }
  });

  ls.on('close', function (code) {
    // console.log('child process exited with code ' + code + ' ' + i++);
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
