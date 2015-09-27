import fs from 'fs';
import path from 'path';

export let getFolder = (folderPath) => {
	let acc = [];

	let h = (folderPath) => {
		let dir = fs.readdirSync(folderPath);
		let mp3 = [];

		dir.forEach((file) => {
			let stat = fs.statSync(folderPath + '/' + file);
			if (stat.isDirectory()) {
				h(folderPath + '/' + file);
			} else if (path.extname(file) === '.mp3') {
				mp3.push(folderPath + '/' + file);
			}
		});

		if (mp3.length > 0) {
			acc.push({
				folder: folderPath,
				mp3: mp3
			});
		}
	};

	h(folderPath);
	return acc;
};

import id3 from 'id3js';
import Promise from 'bluebird';
import domain from 'domain';

let id3Async = Promise.promisify(id3);

export let getTags = (collection) => {
	let folderPromise = (folder) => {
		return Promise.reduce(folder.mp3, (total, current) => {
			return new Promise((resolve, reject) => {
				var d = domain.create();

				d.on('error', function(err) {
					total.push({
						url: current,
						artist: path.basename(current)
					});

					resolve(total);
				});

				d.run(function() {
					id3Async({ file: current, type: id3.OPEN_LOCAL }).then((tags) => {
						if (tags.artist && tags.title) {
							total.push({
								url: current,
								artist: tags.artist.replace(/\0/g, ''),
								title: tags.title.replace(/\0/g, '')
							});
						} else {
							total.push({
								url: current,
								artist: path.basename(current)
							});
						}

						resolve(total);
					});
				});
			});
		}, []);
	};

	return Promise.reduce(collection, (total, current) => {
		return folderPromise(current).then((result) => {
			current.mp3 = result;

			total.push(current);
			return total;
		});
	}, []);
};

import { format } from './music-actions';

export let flattenCollection = (collection) => {
	let result = [];

	collection.forEach((folder) => {
		result.push({
			label: path.basename(folder.folder),
			folder: folder.folder
		});
		folder.mp3.forEach((file) => {
			result.push(file);
		});
	});

	return format(result);
};
