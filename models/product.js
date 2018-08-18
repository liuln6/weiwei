var express=require('express');
var router=express.Router();
//引入数据库包
var mysql= require('mysql');
//var db=require('../db/dbprovider.js');
var moment=require('moment');
var sql=require('../db/productSQL.js');

var path=require('path');
var async=require('async');

var bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


const dbconfig = {
    host     : '39.107.252.17',
    user     : 'root',
    password : 'lina2010',
    port     : '3306',
    database : 'WeiWeiStock',
    useConnectionPooling:true,
    multipleStatements: true
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

//查询成功后关闭mysql
function closeMysql(connect){
    connect.end((err)=>{
        if(err){
            console.log(`mysql关闭失败:${err}!`);
        }else{
            console.log('mysql关闭成功!');
        }
    });
    // connect.destory();   //end()和destory()都可以关闭数据库
}

/**
库存查询列表
**/
router.get('/',function (req,res,next) {
	handleDisconnect();
	connection.query(sql.queryAll,function (err,rows) {
		console.log(rows);
		closeMysql(connection);
		if(err){
			res.render('product',{title:'入库',datas:[]});
		}else{
			res.render('product',{title:'入库',datas:rows});
		}
	});
});
router.get('/getwarehouselist',function (req,res) {
	handleDisconnect();
	connection.query(sql.queryHouseAll,function (err,rows) {
		closeMysql(connection);
		if(err){
			res.send('获取仓库数据失败'+err);
		}
		else{

			res.json({"result":{rows:rows}});
		}
	});
});
/**
产品详情页面
**/
router.get('/info',function (req,res,next) {
	var productID=req.query.ID;
	res.render('productinfo',{title:'产品详情页面【'+productID+'】',id:productID});

});
router.post('/info',function (req,res,next) {
	var productID=req.body.ID;
	console.log(productID);
	handleDisconnect();
	var product={};
	connection.query(sql.queryProductByID,[productID,productID,productID],function (err,result) {
		closeMysql(connection);
		if(err){
			res.send('获取所有产品信息失败'+ err);
		}else{
			var resultProduct = JSON.stringify(result[0]);
	        var resultImg = JSON.stringify(result[1]);
	        var resultType=JSON.stringify(result[2]);
	        resultProduct= JSON.parse(resultProduct);//把results字符串转为json对象
	        resultImg=JSON.parse(resultImg);
	        resultType=JSON.parse(resultType);
			product=resultProduct[0];
			product.ImageList=resultImg;
			product.TypeList=resultType;
			res.json({"result":"true","model":product});
		}
	});
});
/**
代客下单时选择产品
**/
router.get('/getProductAll',function (req,res) {
	handleDisconnect();
	connection.query(sql.queryPouductAllForSelect,function (err,rows) {
		closeMysql(connection);
		if(err){
			res.send('获取所有产品信息失败'+ err);
		}else{
			res.json(rows);
		}
	});
});
router.get('/getProductAllByName',function (req,res) {
	var name=req.query.q;
	console.log(name)
	handleDisconnect();
	connection.query(sql.queryPouductAllByName,['%'+name+'%'],function (err,rows) {
		closeMysql(connection);
		if(err){
			res.send('获取所有产品信息失败'+ err);
		}else{
			res.json(rows);
		}
	});
});
/**
产品列表
**/
router.get('/getProductAllList',function (req,res) {
	handleDisconnect();
	connection.query(sql.queryProductAll,function (err,rows) {
		closeMysql(connection);
		if(err){
			res.send('获取所有产品信息失败'+ err);
		}else{
			res.json(rows);
		}
	});
});
router.get('/queryProductTypeListForPack',function (req,res) {
	handleDisconnect();
	connection.query(sql.queryProductTypeListForPack,function (err,rows) {
		closeMysql(connection);
		if(err){
			res.send('获取所有产品信息失败'+ err);
		}else{
			res.json(rows);
		}
	});
})
router.get('/packinfo',function (req,res,next) {
	var ID=req.query.ID;
	res.render('packinfo',{title:'打包【'+ID+'】',id:ID});

});
router.post('/packinfo',function (req,res) {
	var typeID=req.body.ID;
	console.log(typeID);
	handleDisconnect();
	var orderList=[];
	var typeInfo={};
	connection.query(sql.queryTypeInfo,[typeID,typeID],function (err,result) {
		closeMysql(connection);
		if(err){
			res.send('获取打包信息失败'+ err);
		}else{
			console.log(result);
			var resultType = JSON.stringify(result[0]);
	        var resultOrder=JSON.stringify(result[1]);
	        resultType= JSON.parse(resultType);//把results字符串转为json对象
	        resultOrder=JSON.parse(resultOrder);
			typeInfo=resultType[0];
			console.log(typeInfo);
			console.log(resultOrder);
			typeInfo.OrderList=resultOrder;
			console.log(typeInfo);
			res.json({"result":"true","model":typeInfo});
			//res.render('packinfo',{model:typeInfo,orderList:resultOrder});
		}
	});
})

router.post('/userproductinfo',function (req,res) {
	var userID=req.body.ID;
	console.log(userID);
	handleDisconnect();
	var orderList=[];
	var userInfo={};
	connection.query(sql.queryUserOrderInfo,[userID,userID,userID],function (err,result) {
		closeMysql(connection);
		if(err){
			res.send('获取打包信息失败'+ err);
		}else{
			console.log(result);
			var resultUser = JSON.stringify(result[0]);
	        var resultAddress=JSON.stringify(result[1]);
	        var resultOrder=JSON.stringify(result[2]);
	        resultUser= JSON.parse(resultUser);//把results字符串转为json对象
	        resultAddress=JSON.parse(resultAddress);
	        resultOrder=JSON.parse(resultOrder);
			userInfo=resultUser[0];
			console.log(userInfo);
			console.log(resultOrder);
			userInfo.OrderList=resultOrder;
			userInfo.AddressList=resultAddress;
			console.log(userInfo);
			res.json({"result":"true","model":userInfo});
		}
	});
})
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
	var TotalNumber=req.body.TotalNumber;
	var ImageList=req.body.ImageList;
	var TypeList=req.body.ImageType;
	var productName=req.body.ProductName;
	var width=req.body.Width;
	var no=req.body.No;
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
			connection.query(sql.add,[WID,new Date(),InputUerID,Remark,0,TotalNumber,productName,width,no],function (err,result) {
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
				typeData.push([postID,item.price,0,item.totalNum,30,item.id,item.mark]);
			});
			//新增产品类型
			connection.query(sql.addImageType,[typeData],function (err,result) {
				callback(err);
			});
		},
		function (callback) {
			//新增库存添加记录
			var stockData=[];
			TypeList.forEach(function (item,index) {
				stockData.push([TotalNumber,new Date(),item.id,postID]);
			});
			connection.query(sql.addStockList,[stockData],function (err,result) {
				callback(err);
			});
		}
		,function (callback) {
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
			closeMysql(connection);
			res.json({"result": err});
		}else{
			closeMysql(connection);
			res.json({"result":"保存成功","productID":postID});
		}

	});
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
					item.id=results.insertId;
					callback();
        		}
        	});
        },function (err) {
        	closeMysql(connection);
        	if(err){
        		console.log(err); 
        		res.render(err);
        	}else{
        		console.log('Sql执行完成');
        		console.log(resData);
				var sout=JSON.stringify(resData);
		        console.log("返回值："+sout);
				res.end(sout);
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