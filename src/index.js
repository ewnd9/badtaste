let file = __dirname + '/../1.txt';
let data = JSON.parse(require('fs').readFileSync(file, 'utf-8')).result;

let urls = data.map((obj) => obj.url);

let isAdded = true;

let titles = data.map(obj => {
  let result = '';

  result += isAdded ? ' + ' : '   ';
  result += `{bold}${obj.artist}{/bold} - ${obj.title}`.replace(/&amp;/g, '&');

  return result;
});

import playlist from './playlist';
playlist.setPlaylist(data);

import * as player from './player-control';
player.play(playlist.getCurrent());
player.setOnNextSong(() => {
  playlist.moveNext();
  player.play(playlist.getCurrent());

  rightPane.select(playlist.getCurrentIndex());
  rightPane.focus();
});

import { screen, rightPane } from './blessed-gui/render';

rightPane.setItems(titles);
rightPane.on('select', function(item, index) {
  playlist.setCurrent(index);
  player.play(playlist.getCurrent());
});

screen.render();
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});
screen.key(['w'], function(ch, key) {
  player.stop();
});
