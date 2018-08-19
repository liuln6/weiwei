var express=require('express');
var router=express.Router();
//引入数据库包
var mysql= require('mysql');
//var db=require('../db/dbprovider.js');
var moment=require('moment');
var sql=require('../db/orderSQL.js');
var psql=require('../db/productSQL.js');


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
订单列表
**/
router.get('/',function (req,res,next) {
	res.render('order',{title:'下单',datas:[]});
});
router.post('/eidtorder',function (req,res,next) {
    var order={
        ID:req.body.ID,
        Number:req.body.Number,
        diffNumber:req.body.diffNumber,
        Remark:req.body.Remark,
        TypeID:req.body.TypeID,
        TotalPrice:req.body.TotalPrice
    };
    handleDisconnect();
    var tasks=[
        function (callback) {
            //开启事务
            connection.beginTransaction(function(err) {
                callback(err);
            });
        },
        function (callback) {
            //还库存
            connection.query(sql.editStock,[order.diffNumber,order.TypeID],function (err,result) {
                console.log("还库存");
                callback(err);
            });
        },
        function (callback) {
            //修改订单
            connection.query(sql.editOrder,[order.Number,order.TotalPrice,order.Remark,order.ID],function (err,result) {
                console.log("修改成功"+order.ID);
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
            closeMysql(connection);
            res.json({"result": err});
        }else{
            closeMysql(connection);
            res.json({"result":"修改成功","orderID":order.ID});
        }

    });
});
router.get('/post',function (req,res) {
    res.render('post');
    
})
router.get('/postList',function (req,res) {
    handleDisconnect();
    connection.query(sql.queryPostList,function (err,rows) {
        closeMysql(connection);
        if(err){
            res.send('获取所有用户订单信息失败'+ err);
        }else{
            res.json(rows);
        }
    });
});
router.get('/postinfo',function (req,res) {
    res.render('postinfo');
});
/**
分单页面
**/
router.get('/userorder',function (req,res) {
    res.render('userorder');
});
router.get('/queryOrderUserList',function (req,res) {
    handleDisconnect();
    connection.query(sql.queryOrderUserList,function (err,rows) {
        closeMysql(connection);
        if(err){
            res.send('获取所有用户订单信息失败'+ err);
        }else{
            res.json(rows);
        }
    });
});

router.get('/userorderlist',function (req,res) {
    var ID=req.query.ID;
    res.render('userorderlist',{title:'分单【'+ID+'】',id:ID});
});
/**
标记打包
**/
router.post('/setPack',function (req,res) {
    var IsPack=req.body.IsPack;
    var OrderIDs=req.body.OrderIDs;
    var UserID=req.body.UserID;
    console.log(OrderIDs);
    var insertID=0;
    handleDisconnect();
    var tasks=[
        function (callback) {
            //开启事务
            connection.beginTransaction(function(err) {
                callback(err);
            });
        },
        function(callback) {
            //更新打包信息
            connection.query(sql.updatePack,[IsPack,new Date(),OrderIDs],function (err,result) {
                console.log("打包"+OrderIDs);
                callback(err);
            });
        },function (callback) {
            //新建打包记录
            connection.query(sql.insertPack,[new Date(),UserID],function (err,result) {
                insertId=result.insertId;
                callback(err);
            });
            console.log("添加订单与打包信息关联");
        },function (callback) {
            var orderPacks=[];
            OrderIDs.forEach(function (item,index) {
                orderPacks.push([insertId,item,new Date()])
            });
            connection.query(sql.insertOrderPack,[orderPacks],function (err,result) {
                callback(err);
            });
            console.log("添加订单与打包信息关联");
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
            closeMysql(connection);
            res.json({"result": err});
        }else{
            closeMysql(connection);
            res.json({"result":"打包成功"});
        }

    });
});
/**
下单页面
**/
router.get('/add',function (req,res) {
	res.render('editorder');
});
router.post('/add',function (req,res) {
    handleDisconnect();
    var order={
        productName:req.body.productName,
        productID:req.body.productID,
        typeID:req.body.typeID,
        userWeiXinID:req.body.userWeiXinID,
        userID:req.body.userID,
        userWeiXinName:req.body.userWeiXinName,
        userName:req.body.userName,
        number:req.body.number,
        price:req.body.price,
        totalPrice:req.body.totalPrice,
        remark:req.body.remark
    };
    var now=new Date();
    var year=now.getFullYear();
    var month=now.getMonth()+1;
    var day=now.getDay();
    var orderNO=year+''+month+''+day+''+order.productID+''+order.typeID+''+generateMixed(4);

    var orderID=0;
    var tasks=[
        function (callback) {
            //开启事务
            connection.beginTransaction(function(err) {
                callback(err);
            });
        },
        function(callback) {
            //新增订单
            connection.query(sql.add,[order.productID,order.typeID,orderNO,order.price,order.userID,new Date(),order.totalPrice,order.number,order.userWeiXinID,order.remark,order.userWeiXinName],function (err,result) {
                orderID=result.insertId;
                console.log("下单");
                callback(err);
            });
        },function (callback) {
            //减库存 产品
            connection.query(psql.minuxNumber,[order.number,order.productID],function (err,result) {
                callback(err);
            });
            console.log("减库存 产品");
        },function (callback) {
            //减库存 类型
            connection.query(psql.minuxNumberType,[order.number,order.typeID],function (err,result) {
                callback(err);
            });
            console.log("减库存 类型");
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
            closeMysql(connection);
            res.json({"result": err});
        }else{
            closeMysql(connection);
            res.json({"result":"保存成功","orderID":orderID});
        }

    });
})
/**
新下单列表
**/
router.get('/queryAllNoPack',function (req,res) {
    handleDisconnect();
    connection.query(sql.queryAllNoPack,function (err,rows) {
        closeMysql(connection);
        if(err){
            res.send('获取所有产品信息失败'+ err);
        }else{
            res.json(rows);
        }
    });
});
//删除订单
router.post('/delOrder',function (req,res) {
    var ID=req.body.ID;
    var TypeID=req.body.TypeID;
    handleDisconnect();
    
    var tasks=[
        function (callback) {
            //开启事务
            connection.beginTransaction(function(err) {
                callback(err);
            });
        },
        function (callback) {
            //还库存
            connection.query(sql.rebackStock,[ID,TypeID],function (err,result) {
                console.log("还库存");
                callback(err);
            });
        },
        function (callback) {
            //删除订单
            connection.query(sql.delOrder,[ID],function (err,result) {
                console.log("删除订单"+ID);
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
            closeMysql(connection);
            res.json({"result": err});
        }else{
            closeMysql(connection);
            res.json({"result":"删除成功","orderID":ID});
        }

    });
});
var chars = ['0','1','2','3','4','5','6','7','8','9'];
function generateMixed(n) {
     global.res = "";
     for(var i = 0; i < n ; i ++) {
         var id = Math.ceil(Math.random()*61);
         res += chars[id];
     }
    return global.res;
}
module.exports=router;