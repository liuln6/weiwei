mysqlConfig:{
	production:{
		host:'39.107.252.17',
		user:'root',
		password:'lina2010',
		port:'3306',
		database:'WeiWeiStock'
	}
};
var mysql=require('mysql');
var connection=mysql.createConnection(mysqlConfig);
connection.connect();

var sql='SELECT * from WeiManager';

connection.query(sql,function (err,result) {
	if(err){
		console.log('查询报错-',err.message);
		return;
	}
   console.log('--------------------------SELECT----------------------------');
   console.log(result);
   console.log('------------------------------------------------------------\n\n');  
});