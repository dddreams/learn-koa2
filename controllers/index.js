
var fn_index = async (ctx, next) => {
	ctx.render('index.html', {
        title: 'Welcome'
    });
}

var fn_signin = async(ctx, next) => {
	var email = ctx.request.body.email || "";
	var password = ctx.request.body.password || "";
	console.log(`signin with email: ${email}, password: ${password}`);
	if(email === 'koa@shure.com' && password === '123456'){
		ctx.render('signin-ok.html', {
			title: 'Sign In Ok!',
			name: 'shure'
		});
	} else {
		ctx.render('signin-failed.html', {
			title: 'Sign In Failed!'
		});
	}
}

module.exports = {
	'GET /' : fn_index,
	'POST /signin': fn_signin
}