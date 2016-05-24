require('./api-init')
  .then(() => {
    const gm = require('../dist/api/gm-api');
    return gm.getAlbum('Bjus5ian4mrn2twfpm7fzlrghyy')
  })
  .then(album => {
    console.log(require('util').inspect(album, { depth: null })); // only tracks, no art

    const track = album[0];
    return track.url();
  })
  .then(data => {
    console.log(data)
  })
  .catch(err => console.log(err.stack || err));
