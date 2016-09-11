
const defaultConfig = './config-default.js';
const testConfig = './config-test.js';


var config = null;

if(process.env.NODE_EVN === 'test'){
	config = require(testConfig);
	console.log('loadding......test-config....');
} else {
	config = require(defaultConfig);
	console.log('loadding......default-config....');
}

module.exports = config;