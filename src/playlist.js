let playlist = [];
let current = 0;

export default {
  setPlaylist: (_playlist) => {
    playlist = _playlist;
    current = 0;
  },
  push: (track) => playlist.push(track),
  get: (index) => playlist[index],
  getCurrent: () => {
    if (playlist[current % playlist.length] != undefined) {
      return playlist[current % playlist.length].url
    }else return "#undefined";
  },
  getCurrentItem: () => playlist[current % playlist.length],
  getCurrentIndex: () => current,
  setCurrent: (index) => current = index,
  moveNext: () => current = (current + 1) % playlist.length
};
