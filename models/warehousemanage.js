var express=require('express');
var router=express.Router();
//引入数据库包
var mysql= require('mysql');
//var db=require('../db/dbprovider.js');
var moment=require('moment');
var sql=require('../db/warehouseManageSQL.js');

var path=require('path');

const dbconfig = {
    host     : '39.107.252.17',
    user     : 'root',
    password : 'lina2010',
    port     : '3306',
    database : 'WeiWeiStock'
};

var connection;
function handleDisconnect() {
    connection = mysql.createConnection(dbconfig);
    connection.connect(function(err) {
        if(err) {
            console.log("进行断线重连：" + new Date());
            setTimeout(handleDisconnect, 2000);   //2秒重连一次
            return;
        }
        console.log("连接成功");
    });
    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}
/**
库存查询列表
**/
router.get('/',function (req,res,next) {
	handleDisconnect();
	connection.query(sql.queryAll,function (err,rows) {
		console.log(rows);
		if(err){
			res.render('warehousemanage',{title:'入库',datas:[]});
		}else{
			res.render('warehousemanage',{title:'入库',datas:rows});
		}
	});
	connection.end();
});
router.get('/getwarehouselist',function (req,res) {
	handleDisconnect();
	connection.query(sql.queryHouseAll,function (err,rows) {
		if(err){
			res.end('获取仓库数据失败'+err);
		}
		else{
			res.json({"result":{rows:rows}});
		}
	});
	connection.end();
});
/**
入库
**/
router.get('/add',function (req,res) {
	res.render('add');
});
router.post('/add',function (req,res) {
	handleDisconnect();
	var WID=req.body.WID;
	var Price=0;
	var InputUerID=1;
	var Remark=req.body.Remark;
	var UsedNumbr=0;
	connection.query(sql.add,[WID,Price,new Date(),InputUerID,Remark,0],function (err,result) {
		if(err){
			res.end('新增失败'+err);
		}else{
			
			var newID=result.insertId;
			
			res.json(result.insertId);
		}
	});
	//web请求中可以不断连接
    connection.end();
});

function mkdir(dirpath) {
	if(!fs.existsSync(path.dirname(dirpath))){
		mkdir(path.dirname(dirpath))
	}
	fs.mkdirSync(dirpath);
}

var formidable = require('formidable'),
    util = require('util'),fs=require('fs');
router.use('/upload',function (req,res) {
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
        file.path='tmp/' + year +'/' + month + '/' + ms+'.'+types[1];
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
        //新增图片
        handleDisconnect();
		var values=[];
		var resData=[];
		docs.forEach(function (item,index) {
			connection.query(sql.addImages,[item.path,new Date(),0],function (err,rows,fields) {
				if(err){
					console.log("添加图片失败",err.message);
					res.json("添加图片失败");
				}
				else{
					resData.push({
						url:item.path,
						id:rows.insertId
					});
				}	
			});
		});
		console.log(resData);
		
		connection.end();
        var sout=JSON.stringify(resData);
        res.end(sout);
    });

    form.parse(req, function(err, fields, files) {
        err && console.log('formidabel error : ' + err);

        console.log('parsing done');
    });
});

module.exports=router;