var Player = require('player');
var player = null;

process.stdin.on('data', function(chunk) {
  var line = chunk.toString().trim();

  if (line === 'pause') {
    player.pause();
  } else {
    player = new Player([]);

    player.add(line);
    player.play();

    // player.on('playend',function(data) {
    //   process.exit(0);
    // });

    player.on('error', function(err) {
      process.stderr.write(err);
      process.exit(1);
    });
  }
});

process.once('SIGTERM', function () {
  process.exit(0);
});
