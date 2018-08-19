var express=require('express');
var path=require('path');
var app=express();

var bodyParser = require('body-parser');  
// parse application/x-www-form-urlencoded  
app.use(bodyParser.urlencoded({ extended: false }))  
// parse application/json  
app.use(bodyParser.json())  

//产品
var product=require('./models/product.js');
//订单
var order=require('./models/order.js');
//用户
var user=require('./models/user.js');

//设置handlebars视图引擎
var handlebars=require('handlebars');
	.create({
		defaultLayout:'main',
		helpers:{
			section:function (name,options) {
				if(!this._sections) this._sections={};
				this._sections[name] = options.fn(this);
				return null;
			}
		}
	});

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.use(express.static(__dirname +'/public'));



app.set('port',process.env.PORT||3000);
//图片上传


app.get('/',function (req,res) {
	res.render('home');
});
app.use('/product',product);
app.use('/order',order);
app.use('/user',user);
app.get('/stock',function (req,res) {
	res.render('stock');
});
//编辑布信息
app.get('/editbubu',function (req,res) {
	res.render('editbubu');
});
//布信息列表
app.get('/bubulist',function (req,res) {
	res.render('bubulist');
});
//添加订单
app.get('/editorder',function (req,res) {
	res.render('editorder');
});
//订单列表
app.get('/orderlist',function (req,res) {
	res.render('orderlist');
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