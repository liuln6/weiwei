var express=require('express');
var path=require('path');
var app=express();

var fs=require('fs');

var warehousemanage=require('./models/warehousemanage');

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


app.use(require('body-parser')());

app.set('port',process.env.PORT||3000);
//图片上传



function mkdir(dirpath) {
	if(!fs.existsSync(path.dirname(dirpath))){
		mkdir(path.dirname(dirpath))
	}
	fs.mkdirSync(dirpath);
}

var formidable = require('formidable'),
    util = require('util'),fs=require('fs');
app.use('/upload',function (req,res) {
	// parse a file upload
    var form = new formidable.IncomingForm(),files=[],fields=[],docs=[];
    console.log('start upload');
    var now=new Date();
	var year=now.getFullYear();
	var month=now.getMonth()+1;

    //存放目录
    form.uploadDir = 'public/tmp/' + year +'/' + month + '/';

    let myPath=form.uploadDir;
    fs.existsSync(myPath)==false&&mkdir(myPath);

    form.on('field', function(field, value) {
        //console.log(field, value);
        fields.push([field, value]);
    }).on('file', function(field, file) {
        console.log(field, file);
        files.push([field, file]);


        var types = file.name.split('.');
        var date = new Date();
        var ms = Date.parse(date);
        fs.renameSync(file.path, 'public/tmp/' + year +'/' + month + '/' + ms+'.'+types[1] );
        file.path='public/tmp/' + year +'/' + month + '/' + ms+'.'+types[1];
        docs.push(file);
    }).on('end', function() {
        console.log('-> upload done');
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        var out={Resopnse:{
            'result-code':0,
            timeStamp:new Date()
        },
        files:docs
        };
        var sout=JSON.stringify(out);
        res.end(sout);
    });

    form.parse(req, function(err, fields, files) {
        err && console.log('formidabel error : ' + err);

        console.log('parsing done');
    });
});

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