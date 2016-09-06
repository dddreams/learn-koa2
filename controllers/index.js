
var fn_index = async (ctx, next) => {
	ctx.response.body = `
		<h1>Index</h1>
		<form action="/signin" method="post">
			<p>Name: <input name="name" /></p>
			<p>Passd: <input type="password" name="password" /></p>
			<p><input type="submit" value="Submit" /></p>
		</form>
	`;
}

var fn_signin = async(ctx, next) => {
	var name = ctx.request.body.name || "";
	var password = ctx.request.body.password || "";
	console.log(`signin with name: ${name}, password: ${password}`);
	if(name === 'koa' && password === '123456'){
		ctx.response.body = `<h1>Welcome ${name}</h1>`;
	} else {
		ctx.response.body = `<h1>Login faild!</h1>
		<p><a href="/">Try again</a></p>`;
	}
}

module.exports = {
	'GET /' : fn_index,
	'POST /signin': fn_signin
}