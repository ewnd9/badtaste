#!/usr/bin/env node

require('babel/register')({ only: __dirname + '/src' });
require('./src/index');
