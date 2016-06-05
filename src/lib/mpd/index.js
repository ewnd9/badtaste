// inspired by https://github.com/mink0/mu-player/blob/master/src/player/player-control.js

import komponist from 'komponist';
import pify from 'pify';

const HOST = 'localhost';
const PORT = '6600';

export default Mpd;

function Mpd() {
  this.isPlaying = false;

  this.mpd = komponist.createConnection(PORT, HOST, (err, client) => {
    if (err) {
      Logger.error(err);
      return;
    }

    this.client = client;
  });
  this.mpd.on('changed', this.onChanged.bind(this));
}

Mpd.prototype.onChanged = function(system) {
  Logger.info('onChaned', system);
  if (system === 'player') {
    return this.updateStatus();
  }
};

Mpd.prototype.updateStatus = function() {
  pify(this.mpd.status.bind(this.mpd))()
    .then(status => {
      if (status.state === 'stop' && !status.songid) {
        this.callback();
      }
    })
    .catch(err => Logger.error(err));
};

Mpd.prototype.killPlayer = function() {
  if (this.client) {
    this.client.stop();
  }
};

Mpd.prototype.setOnNextSongCallback = function(callback) {
  this.callback = callback;
};

Mpd.prototype.play = function(url) {
  this.isPlaying = true;

  pify(this.mpd.addid.bind(this.mpd))(url)
    .then(id => {
      const mpdId = id.Id;
      return this.mpd.playid(mpdId);
    })
    .catch(err => Logger.error(err));
};

Mpd.prototype.pause = function() {
  this.mpd.toggle();
};
