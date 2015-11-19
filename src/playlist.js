let originalPlaylist = [];
let playlist = [];
let current = 0;

export default {
  setPlaylist: (_playlist) => {
    originalPlaylist = _playlist;
    playlist = _playlist;
    current = 0;
  },
  filter: (pattern) => {
    if (!pattern || pattern.length === 0) {
      playlist = originalPlaylist;
    } else {
      let s = pattern.toLowerCase();
      playlist = originalPlaylist.filter((track) => {
        return track.artist.toLowerCase().indexOf(s) > - 1 ||
               track.title.toLowerCase().indexOf(s) > -1;
      });
    }

    return playlist;
  },
  push: (track) => playlist.push(track),
  get: (index) => playlist[index],
  getLength: () => playlist.length,
  getCurrent: () => playlist[current % playlist.length].url,
  getCurrentItem: () => playlist[current % playlist.length],
  getCurrentIndex: () => current,
  setCurrent: (index) => current = index,
  moveNext: () => current = (current + 1) % playlist.length
};
