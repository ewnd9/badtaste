#!/usr/bin/env node

var winston = require('winston');
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'info-file',
      filename: __dirname + '/logs/badtaste-info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: __dirname + '/logs/badtaste-error.log',
      level: 'error'
    })
  ]
});
global.Logger = logger;

require('babel/register')({ only: __dirname + '/src' });
require('./src/index');
