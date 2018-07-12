var express=require('express');
var app=express();

//设置handlebars视图引擎
var handlebars=require('express3-handlebars')
	.create({defaultLayout:'main'});
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.use(express.static(__dirname +'/public'));


app.use(require('body-parser')());

app.set('port',process.env.PORT||3000);
app.get('/',function (req,res) {
	res.render('home');
});
app.get('/stock',function (req,res) {
	res.render('stock');
});
//编辑布信息
app.get('/editbubu',function (req,res) {
	res.render('editbubu',{ layout:'editbubu'});
});
//布信息列表
app.get('/bubulist',function (req,res) {
	res.render('bubulist',{layout:'bubulist'});
});
//添加订单
app.get('/editorder',function (req,res) {
	res.render('editorder',{layout:'editorder'});
});
//订单列表
app.get('/orderlist',function (req,res) {
	res.render('orderlist',{layout:'orderlist'});
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