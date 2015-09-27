import _ from 'lodash';

export let formatTrack = (track) => {
	if (track.label) {
		return `{blue-fg}${track.label}{/blue-fg}`;
	}

  let result = `{bold}${track.artist}{/bold}`;

	if (track.title) {
		result += ` - ${track.title}`;
	}

  if (track.duration) {
    let duration = _.padLeft(track.duration / 60 | 0, 2, '0') + ':' + _.padLeft(track.duration % 60, 2, '0');
    result += ` {|}${duration}`;
  }

  if (!track.url) {
    result = `Not Found: ${result}`;
  }

  return result;
};

export let format = (items) => {
	return items.map(obj => {
		obj.trackTitle = formatTrack(obj);
		obj.trackTitleFull = obj.trackTitle;

		return obj;
	});
};
