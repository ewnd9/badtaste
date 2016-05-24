import { spawn } from 'child_process';

export default Player;

function Player() {
  this.proc = null;
  this.callback = () => Logger.info('no next song');
}

Player.prototype.play = function(url) {
  this.killPlayer();
  setTimeout(this.createProcess.bind(this, url), 100);
};

Player.prototype.pause = function() {
  this.proc.stdin.write('pause');
};

Player.prototype.killPlayer = function() {
  if (this.proc) {
    this.proc.stdin.pause();
    this.proc.kill('SIGTERM');
  }
};

Player.prototype.setOnNextSongCallback = function(callback) {
  this.callback = callback;
};

Player.prototype.createProcess = function(url) {
  Logger.info(`playing ${url}`);

  this.proc = spawn('node', [`${__dirname}/player.js`]);
  this.proc.stdin.write(url);

  this.proc.stdout.on('data', buffer => {
    Logger.info('stdout: ' + buffer.length);
  });

  this.proc.stderr.on('data', buffer => {
    const data = buffer.toString().trim();

    if (data === 'No next song was found') {
      this.callback();
    } else {
      Logger.error(data.substr(0, 100));
    }
  });

  this.proc.on('close', function(code) {
    Logger.error(`child process exited with code: ${code}`);
  });
};
