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
router.post('/add',function (req,res) {
    var user={
        ID:0,
        WeiXinID:req.body.WeiXinID,
        WeiXinName:req.body.WeiXinName,
        UserName:req.body.UserName,
        Phone:req.body.Phone,
        Address:req.body.Address,
        ZipCode:req.body.ZipCode
    }
    var insertID=0;
    handleDisconnect();
    var tasks=[
        function (callback) {
            //开启事务
            connection.beginTransaction(function(err) {
                callback(err);
            });
        },
        function (callback) {
            //新增用户
            connection.query(sql.add,[user.WeiXinID,user.WeiXinName,user.UserName,new Date()],function (err,result) {
                insertID=result.insertId;
                callback(err);
            });
        },function (callback) {
            //新增用户地址
            connection.query(sql.addAddress,[insertID,user.Address,user.UserName,user.Phone,user.ZipCode,new Date()],function (err,result) {
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
            res.json({"result":"保存成功","insertID":insertID});
        }

    });

});
router.get('/getUser',function (req,res) {
    var id=req.query.ID;
    var userInfo={
        ID:0,
        WeiXinID:0,
        WeiXinName:'',
        UserName:'',
        AddressList:[],
    };
    connection.query(sql.queryByID,[id,id],function (err,result) {
        console.log(result[0]);
        console.log(result[1]);
        if(err){
            console.log(err);
            connection.rollback();//发生错误时回滚
            res.json({"result": err});
        }else{
            userInfo={
                ID:result[0].ID,
                WeiXinID:result[0].WeiXinID,
                WeiXinName:result[0].WeiXinName,
                UserName:result[0].UserName,
                AddressList:result[1],
            };
            res.json({"result":"保存成功","model":userInfo});
        }

    });
});
module.exports=router;