var fs = require('fs');
var expect = require('chai').expect;

describe('gmSpec', () => {

	let boot = require('./boot');
  let pm = require('./../src/actions/gm-actions').pm;

  it('playlists', function(done) {
		this.timeout(10000);
		boot().then(() => {
			pm.getPlayLists(function(err, data) {
	      console.log(JSON.stringify(data, null, 2));
				done();
	    });
		});
  });

});
