'use strict';

require('babel-register');
global.Logger = console;

const fs = require('fs');
const expect = require('chai').expect;

describe('vkSpec', () => {

  const boot = require('./boot').default;
  const vk = require('../src/api/vk-api');

  it('getOwnerIdByUrl user', (done) => {
    const url = 'https://vk.com/durov';

    vk
      .getOwnerIdByUrl(url)
      .then(result => {
        expect(result).to.equal(1);
        done();
      })
      .catch(done);
  });

  it('getOwnerIdByUrl community', (done) => {
    const url = 'https://vk.com/cliqque';

    vk
      .getOwnerIdByUrl(url)
      .then(result => {
        expect(result).to.equal(-66687279);
        done();
      })
      .catch(done);
  });

  it('getOwnerIdByUrl not existing', (done) => {
    const url = 'https://vk.com/cliqqueasdasdjkas;dasd';

    vk
      .getOwnerIdByUrl(url)
      .then(result => {
        done(new Error('shouldn\'t be correct'));
      })
      .catch(err => done());
  });

  // it('album', (done) => {
  //   var url = 'http://vk.com/audios-2266?album_id=64735015';
  //   vk.detectUrlType(url).then((result) => {
  //     expect(result.type).to.equal('audio');
  //     expect(result.owner_id).to.equal('-2266');
  //     expect(result.album_id).to.equal('64735015');
  //     done();
  //   });
  // });
  //
  // it('wall', (done) => {
  //   var url = 'http://vk.com/wall-439285_226096';
  //   vk.detectUrlType(url).then((result) => {
  //     expect(result.type).to.equal('wall');
  //     expect(result.id).to.equal('-439285_226096');
  //     done();
  //   });
  // });
  //
  // it('page', (done) => {
  //   var url = 'http://vk.com/denoisia';
  //   vk.detectUrlType(url).then((result) => {
  //     expect(result.type).to.equal('audio');
  //     expect(result.owner_id).to.equal('-26942782');
  //     done();
  //   });
  // });
  //
  // it('recommendations', (done) => {
  //   vk.getRecommendations().then((result) => {
  //     expect(result.length).to.equal(99);
  //     done();
  //   });
  // });
  //
  // it('albums list', (done) => {
  //   vk.getAlbums().then((result) => {
  //     expect(result.length).to.equal(23);
  //     done();
  //   });
  // });

});
