var express=require('express');
var router=express.Router();
//引入数据库包
var mysql= require('mysql');
//var db=require('../db/dbprovider.js');
var moment=require('moment');
var sql=require('../db/productSQL.js');

var path=require('path');
var async=require('async');

const dbconfig = {
    host     : '39.107.252.17',
    user     : 'root',
    password : 'lina2010',
    port     : '3306',
    database : 'WeiWeiStock',
    useConnectionPooling:true
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
});
router.get('/getwarehouselist',function (req,res) {
	handleDisconnect();
	connection.query(sql.queryHouseAll,function (err,rows) {
		if(err){
			res.send('获取仓库数据失败'+err);
		}
		else{

			res.json({"result":{rows:rows}});
		}
	});
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
	var InputUerID=1;
	var Remark=req.body.Remark;
	var UsedNumbr=0;
	var ImageList=req.body.ImageList;
	var TypeList=req.body.ImageType;
	var postID=null;
	var tasks=[
		function (callback) {
			//开启事务
			connection.beginTransaction(function(err) {
				callback(err);
			});
		},
		function(callback) {
			//新增产品
			connection.query(sql.add,[WID,new Date(),InputUerID,Remark,0],function (err,result) {
				postID=result.insertId;
				callback(err);
			});
		},function (callback) {
			//添加图片与产品的关联关系
			var typeData=[];
			console.log(ImageList);
			ImageList.forEach(function (item,index) {
				typeData.push([item.mark,item.id,postID]);
			});
			//新增产品与图片的关联关系
			connection.query(sql.addProductImage,[typeData],function (err,result) {
				callback(err);
			});
		},
		function(callback) {
			var typeData=[];
			console.log(TypeList);
			TypeList.forEach(function (item,index) {
				typeData.push([postID,item.price,0,item.totalNum,1,item.id,item.mark]);
			});
			//新增产品类型
			connection.query(sql.addImageType,[typeData],function (err,result) {
				callback(err);
			});
		},function (callback) {
			//提交事务
			connection.commit(function (err) {
				callback(err);
			});
		}
	];
	async.series(tasks,function (err,results) {
		if(err){
			console.log(err);
			connection.rollback();//发生错误时回滚
			res.json({"result": err});
		}else{
			res.json({"result":"保存成功"});
		}

	});
});

function mkdir(dirpath) {
	if(!fs.existsSync(path.dirname(dirpath))){
		mkdir(path.dirname(dirpath))
	}else
	{
		//
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
        var msfive=generateMixed(5);
        fs.renameSync(file.path, 'public/tmp/' + year +'/' + month + '/' + ms + msfive+'.'+types[1] );
        file.path='tmp/' + year +'/' + month + '/' + ms+msfive+'.'+types[types.length-1];
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
        var resData=[];
        async.eachSeries(docs,function (item,callback) {
        	//遍历执行新增
        	connection.query(sql.addImages,[item.path,new Date(),0],function (err,results) {
        		if(err){
        			console.log("添加图片失败",err.message);
					res.json("添加图片失败");
        		}else{
        			console.log(results.insertId);
        			
        			resData.push({
						url:item.path,
						id:results.insertId
					});
					callback();
        		}
        	});
        },function (err) {
        	if(err){
        		console.log(err); 
        		connection.end();
        		res.send(err);
        	}else{
        		console.log('Sql执行完成');
        		console.log(resData);
		
		        var sout=JSON.stringify(resData);
		        res.send(sout);
        	}
        });

		
    });

    form.parse(req, function(err, fields, files) {
        err && console.log('formidabel error : ' + err);

        console.log('parsing done');
    });
});
var chars = ['0','1','2','3','4','5','6','7','8','9',
'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
];
function generateMixed(n) {
     global.res = "";
     for(var i = 0; i < n ; i ++) {
         var id = Math.ceil(Math.random()*61);
         res += chars[id];
     }
    return global.res;
}

module.exports=router;