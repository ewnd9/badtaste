var fs = require('fs');
var expect = require('chai').expect;

describe('vkSpec', () => {

  let vk = require('./../src/actions/vk-actions');

  it('album', (done) => {
    var url = 'http://vk.com/audios-2266?album_id=64735015';
    vk.detectUrlType(url).then((result) => {
      expect(result.type).to.equal('audio');
      expect(result.owner_id).to.equal('-2266');
      expect(result.album_id).to.equal('64735015');
      done();
    });
  });

  it('wall', (done) => {
    var url = 'http://vk.com/wall-439285_226096';
    vk.detectUrlType(url).then((result) => {
      expect(result.type).to.equal('wall');
      expect(result.id).to.equal('-439285_226096');
      done();
    });
  });

  it('page', (done) => {
    var url = 'http://vk.com/denoisia';
    vk.detectUrlType(url).then((result) => {
      expect(result.type).to.equal('audio');
      expect(result.owner_id).to.equal('-26942782');
      done();
    });
  });

  it('recommendations', (done) => {
    vk.getRecommendations().then((result) => {
      expect(result.length).to.equal(99);
      done();
    });
  });

});
