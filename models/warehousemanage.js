var express=require('express');
var router=express.Router();
//引入数据库包
var mysql= require('mysql');
var db=require('../db/dbprovider.js');
var moment=require('moment');
var sql=require('../db/warehouseManageSQL.js');

var connection;
function handleDisconnect() {
    connection = mysql.createConnection(db.pool);
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
	db.query('select * from WeiWarehouseManage',function (err,rows) {
		console.log(rows);
		if(err){
			res.render('warehousemanage',{title:'入库',datas:[]});
		}else{
			res.render('warehousemanage',{title:'入库',datas:rows});
		}
	});
});
router.get('/getwarehouselist',function (req,res) {
	db.query("select * from WeiWarehouse",function (err,rows) {
		if(err){
			res.end('获取仓库数据失败'+err);
		}
		else{
			res.json({"result":{rows:rows}});
		}
	});
});
router.get('/getwarehouselistdata',function (req,res) {
	db.query("select * from WeiWarehouse",function (err,rows) {
		if(err){
			res.end('获取仓库数据失败'+err);
		}
		else{
			var formateRows=[];
			rows.forEach(function(item,index){
				console.log(item+'---'+index);
				formateRows.push({id:item.ID,text:item.Name});
			});
			res.json({"results":formateRows});
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
	var Price=0;
	var InputUerID=1;
	var Remark=req.body.Remark;
	var UsedNumbr=0;
	db.query(sql.add,[WID,Price,new Date(),InputUerID,Remark,0],function (err,result) {
		if(err){
			res.end('新增失败'+err);
		}else{
			res.end(res);
			console.info(result);
		}
	});
	connection.query(sql.add,[WID,Price,new Date(),InputUerID,Remark,0],function (err, result) {
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            res.json("添加数据失败");
            return;
        }
        console.log(result);
        res.json("添加数据成功");
    });
	//web请求中可以不断连接
    connection.end();
});
module.exports=router;