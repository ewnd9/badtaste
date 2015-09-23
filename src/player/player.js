var Player = require('player');

process.stdin.on('data', function(chunk) {
  var url = chunk.toString().trim();
  var player = new Player([]);

  player.add(url);
  player.play();

  player.on('playend',function(data) {
    process.exit(0);
  });

  player.on('error', function(err) {
    process.stderr.write(err);
    process.exit(1);
  });
});

process.once('SIGTERM', function () {
  process.exit(0);
});
