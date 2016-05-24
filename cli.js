#!/usr/bin/env node

var intel = require('intel');
intel.addHandler(new intel.handlers.File(process.env.HOME + '/.badtaste-npm-info.log'));
global.Logger = intel;

var updateNotifier = require('update-notifier');
var pkg = require('./package.json');
updateNotifier({ pkg: pkg }).notify();

require('source-map-support').install();
require('./dist/index');
