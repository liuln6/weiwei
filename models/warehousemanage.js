var express=require('express');
var router=express.Router();
//引入数据库包
var db=require('./dbprovider.js');


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
	debugger;
	var WID=req.body.WID;
	var Price=req.body.Price;
	var InputUerID=1;
	var Remark=reg.body.Remark;
	var UsedNumbr=0;
	db.query("insert into WeiWarehouseManage(WID,Price,InputTime,InputUerID,Remark,UsedNumbr) values ('"+WID+"','"+Price+"','"+now()+"','"+InputUerID+"','"+Remark+"',0)",function (err,rows) {
		if(err){
			res.end('新增失败'+err);
		}else{
			res.end(res);
			console.info(rows.ID);
		}
	});
});
module.exports=router;