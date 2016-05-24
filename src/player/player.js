import Player from 'player';

let player;

process.stdin.on('data', function(chunk) {
  const line = chunk.toString().trim();

  if (line === 'pause') {
    player.pause();
  } else {
    player = new Player([]);
    console.log(`url: ${line}`);

    player.add(line);
    player.play();

    player.on('playing', item => {
      console.log(`im playing... src: ${item}`);
    });

    // player.on('playend',function(data) {
    //   process.exit(0);
    // });

    player.on('error', err => {
      process.stderr.write(err);
      process.exit(1);
    });
  }
});

process.once('SIGTERM', function () {
  process.exit(0);
});
