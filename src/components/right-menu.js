import storage, { OPEN_VK, ADD_TO_PROFILE } from './../storage';
import * as vkActions from './../actions/vk-actions';

import playlist from './../playlist';
import * as player from './../player/player-control';

import _ from 'lodash';

import LoadingSpinner from './../tui/loading-spinner';
import InfoBox from './../tui/info-box';

let screen = null;
let rightPane = null;

export default (_screen, _rightPane) => {
  screen = _screen;
  rightPane = _rightPane;

  rightPane.on('select', function(item, index) {
    playlist.setCurrent(index);

    if (playlist.getCurrentItem().notAvailable) {
      rightPane.down(1);
    } else {
      player.play(playlist.getCurrent());
    }
  });

  player.setOnNextSong(() => {
    playlist.moveNext();
    player.play(playlist.getCurrent());

    rightPane.select(playlist.getCurrentIndex());
    rightPane.focus();
  });
};

let loadAudio = (audio) => {
  rightPane.setItems(_.pluck(audio, 'trackTitleFull'));
  rightPane.focus();

  playlist.setPlaylist(audio);
  player.play(playlist.getCurrent());
};

storage.on(OPEN_VK, (payload) => {
  if (payload.type === 'profile') {
    vkActions.getProfileAudio().then(loadAudio).catch((err) => Logger.error(err));
  } else if (payload.type === 'group') {
    vkActions.getGroupAudio(payload.id).then(loadAudio).catch((err) => Logger.error(err));
  } else if (payload.type === 'search') {
    vkActions.getSearch(payload.query).then(loadAudio).catch((err) => Logger.error(err));
  } else if (payload.type === 'tracklist') {
    rightPane.setItems([]);
    playlist.setPlaylist([]);

    let spinner = LoadingSpinner(screen, 'Adding...', false);
    let onTrack = (track, index, length) => {
      rightPane.pushItem(track.trackTitleFull);
      rightPane.focus();

      playlist.push(track);
      spinner.setContent(`${index  + 1} / ${length}. press z to cancel`);
    };

    vkActions.getBatchSearch(payload.tracklist, onTrack).then(() => {
      spinner.stop();
    }).catch((err) => {
      spinner.stop();
      Logger.error(err);
    });
  }
});

storage.on(ADD_TO_PROFILE, () => {
  let selected = playlist.get(rightPane.selected);
  let listEl = rightPane.items[rightPane.selected];

  let addToProfile = () => {
    let spinner = LoadingSpinner(screen, 'Adding...');

    return vkActions.addToProfile(selected).then((selected) => {
      rightPane.setItem(listEl, selected.trackTitleFull);
      rightPane.focus();

      InfoBox(screen, 'Successfully added to your profile');
      spinner.stop();
    }).catch((err) => {
      Logger.error(err);
      spinner.stop();
    });
  };

  let addOnTop = () => {
    let spinner = LoadingSpinner(screen, 'Moving...');

    return vkActions.addOnTop(selected).then((result) => {
      spinner.stop();
    }).catch((err) => {
      Logger.error(err);
      spinner.stop();
    });
  };

  if (selected.isAdded) {
    addOnTop();
  } else {
    addToProfile();
  }
});
