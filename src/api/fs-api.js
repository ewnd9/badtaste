import fs from 'fs';
import path from 'path';

import domain from 'domain';
import Promise from 'bluebird';

import id3 from 'id3js';
const id3Async = Promise.promisify(id3);

import { format } from './music-actions';

export const getFolder = folderPath => {
  const acc = [];

  const h = folderPath => {
    const dir = fs.readdirSync(folderPath);
    const mp3 = [];

    dir
      .forEach(file => {
        const stat = fs.statSync(`${folderPath}/${file}`);

        if (stat.isDirectory()) {
          h(`${folderPath}/${file}`);
        } else if (path.extname(file) === '.mp3') {
          mp3.push(`${folderPath}/${file}`);
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

export const getTags = collection => {
  return Promise
    .reduce(collection, createCollectionPromise, []);
};

function createCollectionPromise(total, current) {
  return Promise
    .reduce(current.mp3, createFolderPromise, [])
    .then(result => {
      current.mp3 = result;

      total.push(current);
      return total;
    });
}

function createFolderPromise(total, current) {
  return new Promise(resolve => {
    const d = domain.create();

    d.on('error', function(err) {
      Logger.error(err);

      total.push({
        url: current,
        artist: path.basename(current)
      });

      resolve(total);
    });

    d.run(function() {
      id3Async({ file: current, type: id3.OPEN_LOCAL })
        .then(tags => {
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
}

export const flattenCollection = collection => {
  const result = [];

  collection
    .forEach(folder => {
      result.push({
        label: path.basename(folder.folder),
        folder: folder.folder
      });
      folder.mp3.forEach(file => {
        result.push(file);
      });
    });

  return format(result);
};
