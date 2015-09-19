#!/usr/bin/env node

var log = require('fs').createWriteStream(__dirname + '/logs/badtaste.log', { flags: 'a' });
process.stdout.pipe(log);
process.stderr.pipe(log);

require('babel/register')({ only: __dirname + '/src' });
require('./src/index');
