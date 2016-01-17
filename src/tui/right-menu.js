import storage, {
  OPEN_VK,
  ADD_TO_PROFILE,
  OPEN_FS,
  FOCUS_RIGHT_PANE,
  MOVE_TO_PLAYING,
  OPEN_GM_ALBUM,
  OPEN_GM_THUMBS_UP,
  OPEN_GM_ALL_TRACKS,
  LOCAL_SEARCH
} from './../storage';

import * as vkActions from './../actions/vk-actions';
import * as fsActions from './../actions/fs-actions';
import * as gmActions from './../actions/gm-actions';

import playlist from './../playlist';
import * as player from './../player/player-control';

import _ from 'lodash';

import LoadingSpinner from './loading-spinner';
import InfoBox from './info-box';
import Toast from './toast';
import { prompt } from './vk-prompts';

import Promise from 'bluebird';

let screen = null;
let rightPane = null;

let playCurrent = () => {
  let urlFinded = false;
  if (playlist.getLength() > 0) {
    while (!urlFinded) {
      let url = playlist.getCurrent();

      if (url) {
        (typeof url === 'function' ? url() : Promise.resolve(url)).then((url) => {
          player.play(url);
          Logger.info(url);
        }).catch((err) => {
          Logger.error(err);
        });

        rightPane.select(playlist.getCurrentIndex());
        storage.emit(FOCUS_RIGHT_PANE);

        urlFinded = true;
      } else {
        playlist.moveNext();
      }
    }
  }
};

export default (_screen, _rightPane) => {
  screen = _screen;
  rightPane = _rightPane;

  rightPane.on('select', function (item, index) {
    playlist.setCurrent(index);
    playCurrent();
  });

  player.setOnNextSong(() => {
    playlist.moveNext();
    playCurrent();
  });
};

let setListElements = (elements) => {
  rightPane.clearItems();
  rightPane.setItems(elements);

  storage.emit(FOCUS_RIGHT_PANE);
};

let setAudio = (audio) => {
  setListElements(_.pluck(audio, 'trackTitleFull'));
  storage.emit(FOCUS_RIGHT_PANE);
};

let loadAudio = (audio) => {
  setAudio(audio);

  playlist.setPlaylist(audio);
  playCurrent();
};

storage.on(LOCAL_SEARCH, (data) => {
  prompt(screen, 'Search', '').then((query) => {
    setAudio(playlist.filter(query));
    playlist.setCurrent(0);

    playCurrent();
  });
});

storage.on(OPEN_VK, (payload) => {
  if (payload.type === 'profile') {
    vkActions.getProfileAudio().then(loadAudio).catch((err) => Logger.error(err));
  } else if (payload.type === 'audio') {
    vkActions.getGroupAudio(payload.owner_id, payload.album_id).then(loadAudio).catch((err) => Logger.error(err));
  } else if (payload.type === 'wall') {
    vkActions.getWallAudio(payload.id).then(loadAudio).catch((err) => Logger.error(err));
  } else if (payload.type === 'search') {
    vkActions.getSearch(payload.query).then(loadAudio).catch((err) => Logger.error(err));
  } else if (payload.type === 'recommendations') {
    vkActions.getRecommendations().then(loadAudio).catch((err) => Logger.error(err));
  } else if (payload.type === 'tracklist') {
    setListElements([]);
    playlist.setPlaylist([]);

    let spinner = LoadingSpinner(screen, 'Adding...', false);
    let onTrack = (track, index, length) => {
      rightPane.pushItem(track.trackTitleFull);
      storage.emit(FOCUS_RIGHT_PANE);

      playlist.push(track);
      spinner.setContent(`${index + 1} / ${length}. press z to cancel`);
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
      storage.emit(FOCUS_RIGHT_PANE);

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

storage.on(OPEN_FS, (data) => {
  let folder = fsActions.getFolder(data.path);

  fsActions.getTags(folder).then((result) => {
    var collection = fsActions.flattenCollection(result);
    loadAudio(collection);
  });
});

storage.on(MOVE_TO_PLAYING, (data) => {
  rightPane.select(playlist.getCurrentIndex());
  storage.emit(FOCUS_RIGHT_PANE);
});

let processGmError = (err) => {
  Logger.error(err);

  if (err.message === 'error getting album tracks: Error: 401 error from server') {
    Toast(screen, 'Auth error');
  }
};

storage.on(OPEN_GM_ALBUM, (data) => {
  gmActions.getAlbum(data.albumId).then((result) => {
    loadAudio(result);
  }).catch(processGmError);
});

storage.on(OPEN_GM_THUMBS_UP, (data) => {
  gmActions.getThumbsUp().then((result) => {
    loadAudio(result);
  }).catch(processGmError);
});

storage.on(OPEN_GM_ALL_TRACKS, (data) => {
  gmActions.getAllTracks().then((result) => {
    loadAudio(result);
  }).catch(processGmError);
});
