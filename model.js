/*读取 models 下面的所有 Model 自动扫描并导入所有Model：*/

const fs = require('fs');
const db = require('./db.js');

let files = fs.readdirSync(__dirname + '/models');

let js_files = files.filter((f) =>{
	return f.endsWith('.js');
}, files);

module.exports = {};

for (let f of js_files){
	let name = f.substring(0, f.length - 3);
	module.exports[name] = require(__dirname + '/models/' + f);
}

module.exports.sync = () => {
	db.sync();
};
