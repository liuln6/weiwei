var express=require('express');

var app=express();

var fs=require('fs');
app.use(require('body-parser')());

// parse application/x-www-form-urlencoded  
app.use(bodyParser.urlencoded({ extended: false }))  
  
// parse application/json  
app.use(bodyParser.json()) 

var warehousemanage=require('./models/warehousemanage.js');

//设置handlebars视图引擎
var handlebars=require('express3-handlebars')
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
app.use('/warehousemanage',warehousemanage);
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