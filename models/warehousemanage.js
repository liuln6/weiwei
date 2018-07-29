var express=require('express');
var router=express.Router();
//引入数据库包
var mysql= require('mysql');
//var db=require('../db/dbprovider.js');
var moment=require('moment');
var sql=require('../db/warehouseManageSQL.js');
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
			

			console.info(result.ID);
		}
	});
	//web请求中可以不断连接
    connection.end();
});
module.exports=router;