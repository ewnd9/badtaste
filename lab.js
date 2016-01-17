#!/usr/bin/env node

var intel = require('intel');
intel.addHandler(new intel.handlers.File(process.env.HOME + '/.badtaste-npm-lab.log'));
global.Logger = intel;

require('babel/register')();
require('./test/lab');
