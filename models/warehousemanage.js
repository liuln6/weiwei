var express=require('express');
var router=express.Router();
//引入数据库包
var db=require('./db.js');

/**
查询列表
**/
router.get('/',function (reg,res,next) {
	db.query('select * from wavehousemanage',function (err,rows) {
		console.log(rows);
		if(err){
			res.render('editbubu',{title:'入库',datas:[]});
		}else{
			res.render('editbubu',{title:'入库',datas:rows});
		}
	});
});
