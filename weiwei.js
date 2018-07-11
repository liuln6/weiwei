var express=require('express');
var app=express();
console.log('dd');
app.set('port',process.env.PORT||3000);
app.get('/',function (req,res) {
	res.type('text/plain');
	res.send('WeiWei');
});
app.get('/stock',function (req,res) {
	res.type('text/plain');
	res.send('库存');
});
//定制404
app.use(function (req,res) {
	res.type('text/plain');
	res.status(404);
	res.send('404 - Not Found')
});
//500
app.use(function (err,req,res,next) {
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 - Server Error');
});
app.listen(app.get('port'),function () {
	console.log('Express started on http://localhost:'+app.get('port')+' press Ctrl-C to terminate');
});