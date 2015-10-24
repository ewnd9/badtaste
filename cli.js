#!/usr/bin/env node

var intel = require('intel');
intel.addHandler(new intel.handlers.File(process.env.HOME + '/.badtaste-npm-info.log'));
global.Logger = intel;

require('babel/register')({ only: __dirname + '/src' });
require('./src/index');
