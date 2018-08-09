var express=require('express');
var router=express.Router();
//引入数据库包
var mysql= require('mysql');
//var db=require('../db/dbprovider.js');
var moment=require('moment');
var sql=require('../db/userSQL.js');

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
用户列表
**/
router.get('/',function (req,res,next) {
	res.render('user',{title:'用户列表',datas:[]});
});

/**
一单时获取用户
**/
router.get('/getAllUser',function (req,res) {
    handleDisconnect();
    connection.query(sql.queryAll,function (err,rows) {
        if(err){
            res.send('获取所有用户信息失败'+ err);
        }else{
            res.json(rows);
        }
    });
});
router.get('/getAllUserByName',function (req,res) {
    var name=req.query.q;
    handleDisconnect();
    connection.query(sql.queryAllByName,['%'+name+'%'],function (err,rows) {
        if(err){
            res.send('获取所有用户信息失败'+ err);
        }else{
            res.json(rows);
        }
    });
});
module.exports=router;