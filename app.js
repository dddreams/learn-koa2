// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');

// 返回一个函数
const router = require('koa-router')();
// 引入koa-bodyparser中间件，用于解析原始 request 请求，解析 post 方式传递的参数
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
// 创建一个Koa对象表示web app本身:
const app = new Koa();

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// parse request body:
app.use(bodyParser());

function addMapping(router, mapping){
	for(var url in mapping){
		if(url.startsWith('GET ')){
			var path = url.substring(4);
			router.get(path, mapping[url]);
		} else if(url.startsWith('POST ')){
			var path = url.substring(5);
			router.post(path, mapping[url]);
		} else {
			console.log(`${url}`);
		}
	}
}

function addControllers(router){
	var files = fs.readdirSync(__dirname + '/controllers');
	var js_files = files.filter((f) => {
		return f.endsWith('.js');
	}, files);

	for (var f of js_files){
		let mapping = require(__dirname + '/controllers/' + f);
		addMapping(router, mapping);
	}
}

addControllers(router);

//router 中间件
app.use(router.routes());

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');