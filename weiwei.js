var express=require('express');
var app=express();

app.use(require('body-parser'));
//设置handlebars视图引擎
var handlebars=require('express3-handlebars')
	.create({defaultLayout:'main'});
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.use(express.static(__dirname +'/public'));

app.set('port',process.env.PORT||3000);
app.get('/',function (req,res) {
	res.render('home');
});
app.get('/stock',function (req,res) {
	res.render('stock');
});
//定制404
app.use(function (req,res) {
	res.status(404);
	res.render('404');
});
//500
app.use(function (err,req,res,next) {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});


app.listen(app.get('port'),function () {
	console.log('Express started on http://localhost:'+app.get('port')+' press Ctrl-C to terminate');
});