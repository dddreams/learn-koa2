/**
 * 为了统一 Model 的定义，新建一个 defaultModel 来规范，
 * 1. 统一主键，名称必须是id，类型必须是STRING(50)；
 * 2. 主键可以自己指定，也可以由框架自动生成（如果为null或undefined）；
 * 3. 所有字段默认为NOT NULL，除非显式指定；
 * 4. 统一timestamp机制，每个Model必须有createdAt、updatedAt和version，分别记录创建时间、
 *    修改时间和版本号。其中，createdAt和updatedAt以BIGINT存储时间戳，最大的好处是无需处理时区，
 *    排序方便。version每次修改时自增。
 */

const Sequlize = require('sequlize');
const uuid = require('node-uuid');
const config = require('./config');

function generateId(){
	return uuid.v4();
}

var sequlize = new Sequlize(config.database, config.username, config.password, {
 	host: config.host,
 	dialect: config.dialect,
 	pool: {
 		max: 5,
 		min: 0,
 		idle: 10000
 	}
});

// 主键类型
const ID_TYPE = Sequlize.STRING(50);

function defineModel(name, attributes){
	var attrs = {};
	for(let key in attributes){
		let value = attributes[key];
		if(typeof value === 'object' && value['type']){
			value.allowNull = value.allowNull || false;
			attrs[key] = value;
		} else {
			attrs[key] = {
				type: value,
				allowNull: false
			};
		}
	}
	attrs.id = {
		type: ID_TYPE,
		primaryKey: true
	};
	attrs.createAt = {
		type: Sequlize.BIGINT,
		allowNull: false
	};
	attrs.updateAt = {
		type: Sequlize.BIGINT,
		allowNull: false
	};
	attrs.version = {
		type: Sequlize.BIGINT,
		allowNull: false
	};

	return sequlize.define(name, attrs, {
		tableName: name,
		timestamps: false,
		hooks: {
			beforeValidate: function(obj){
				let now = Date.now();
				if(obj.isNewRecord){
					if(!obj.id){
						obj.id = generateId();
					}
					obj.createAt = now;
					obj.updateAt = now;
					obj.version = 0;
				} else {
					obj.updateAt = Date.now();
					obj.version ++;
				}
			}
		}
	});
}

const TYPES = ['STRING','INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY','BOOLEAN'];

var exp = {
	defineModel: defaultModel,
	sync: () => {
		if(process.env.NODE_ENV !== 'production'){
			sequlize.sync({force: true});
		} else {
			throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
		}
	}
}

for (let type of TYPES){
	exp[type] = sequlize[type];
}

exp.ID = ID_TYPE;
exp.generateId = generateId;

module.exports = exp;