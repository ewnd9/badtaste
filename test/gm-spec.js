var fs = require('fs');
var expect = require('chai').expect;

describe('gmSpec', () => {

	let boot = require('./boot');
  let pm = require('./../src/actions/gm-actions').pm;

  it('playlists', function(done) {
		this.timeout(10000);
		boot().then(() => {
			pm.getPlayLists(function(err, data) {
	      console.log(data.data);
				console.log(Object.keys(data));
				done();
	    });
		});
  });

  it('thumbs up', function(done) {
		this.timeout(100000);
		boot().then(() => {
			pm.getFavotites(function(err, data) {
				console.log(data.track[0]);
				done();
			});
		});
  });

});
