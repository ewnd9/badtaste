import * as vk from 'vk-universal-api';
import inquirerCredentials from 'inquirer-credentials';
import _ from 'lodash';

import playlist from './playlist';
import * as player from './player/player-control';

import tui from './tui/render';

import LoadingSpinner from './tui/loading-spinner';
import InfoBox from './tui/info-box';
import TracklistPrompt from './tui/tracklist-prompt';

import { vkUrlPrompt, vkSearchPrompt } from './prompts/vk-prompts';

import loadVkAudio, { formatTrackFull } from './menu/vk-audio';
import storage from './storage';

import Promise from 'bluebird';

let authUrl = 'https://oauth.vk.com/authorize?client_id=5075122&scope=audio,offline&redirect_uri=https://oauth.vk.com/blank.html&display=page&v=5.23&response_type=token';
let responseExample = 'https://oauth.vk.com/blank.html#access_token=<85 symbols>&expires_in=0&user_id=<user_id>';

let token = {
  name: 'url',
  type: 'input',
  hint: `Open "${authUrl}" in browser.\nCopy paste new url here.\nIt should look "${responseExample}"`,
  env: 'VK_TOKEN'
};

let tokenRegex = /.+access_token=([a-z0-9]+)&.+/g;

inquirerCredentials('.badtaste-npm-credentials', [token]).then(function(credentials) {
  var match = tokenRegex.exec(credentials.url);
  
  var token = match[1];
  vk.setToken(token);

  let { screen, leftPane, rightPane } = tui();

  player.setOnNextSong(() => {
    playlist.moveNext();
    player.play(playlist.getCurrent());

    rightPane.select(playlist.getCurrentIndex());
    rightPane.focus();
  });

  rightPane.on('select', function(item, index) {
    playlist.setCurrent(index);

    if (playlist.getCurrentItem().notAvailable) {
      rightPane.down(1);
    } else {
      player.play(playlist.getCurrent());
    }
  });

  let searchFn = () => vkSearchPrompt(screen).then((query) => loadVkAudio({ type: 'search', query: query }, rightPane));

  let leftMenu = [];

  let renderLeftPane = () => {
    let leftMenuRaw = [
      {
        name: '{bold}VK{/bold} Profile',
        fn: () => loadVkAudio({ type: 'profile' }, rightPane)
      },
      {
        name: '{bold}VK{/bold} Search',
        fn: searchFn
      },
      storage.data.groups.map((group) => {
        return {
          name: `{bold}VK{/bold} Custom: ${group.name}`,
          fn: () => loadVkAudio({ type: 'group', id: group.id }, rightPane)
        }
      }),
      {
        name: '{bold}VK{/bold} Add group',
        fn: () => vkUrlPrompt(screen).then((data) => {
          let { id, name } = data;

          storage.data.groups.push({
            id: id,
            name: name
          });
          storage.save();

          renderLeftPane();
          leftPane.focus();

          loadVkAudio({ type: 'group', id: id }, rightPane);
        })
      },
      {
        name: '{bold}VK{/bold} Add playlist',
        fn: () => TracklistPrompt(screen).then((text) => {
          rightPane.focus();
          loadVkAudio({ type: 'tracklist', tracklist: text }, rightPane, screen);
        })
      },
    ];

    leftMenu = _.flatten(leftMenuRaw);
    leftPane.setItems(_.pluck(leftMenu, 'name'));
  };

  let selectLeftPane = (item, index) => {
    leftMenu[index].fn();
  };

  leftPane.on('select', selectLeftPane);
  renderLeftPane();
  selectLeftPane(null, 0);

  screen.title = 'badtaste';
  screen.render();

  var isPlaying = true;
  screen.key(['space'], function(ch, key) {
    if (isPlaying) {
      player.stop();
    } else {
      player.play(playlist.getCurrent());
    }

    isPlaying = !isPlaying;
  });

  screen.key(['C-f'], function(ch, key) {
    leftPane.select(1); // @TODO: wow
    leftPane.focus();
    rightPane.focus();

    searchFn();
  });

  let addToProfile = (selected, listEl) => {
    let spinner = LoadingSpinner(screen, 'Adding...');
    return vk.method('audio.add', { audio_id: selected.aid , owner_id: selected.owner_id }).then((result) => {
      spinner.stop();
      selected.isAdded = true;

      rightPane.setItem(listEl, formatTrackFull(selected));
      rightPane.focus();

      InfoBox(screen, 'Successfully added to your profile');
      return true;
    });
  }

  screen.key(['x'], function(ch, key) {
    let selected = playlist.get(rightPane.selected);
    let listEl = rightPane.items[rightPane.selected];

    (selected.isAdded ? Promise.resolve(true) : addToProfile(selected, listEl)).then(() => {

      let spinner = LoadingSpinner(screen, 'Moving...');

      return vk.method('audio.get', { need_user: 1, count: 1 }).then((result) => {
        let currentTopTrack = result.items[0];
        return vk.method('audio.reorder', { audio_id: selected.aid, before: currentTopTrack.aid });
      }).then((result) => {
        spinner.stop();
      }).catch((err) => {
        Logger.error(err);
        spinner.stop();
      });

    });
  });
});
