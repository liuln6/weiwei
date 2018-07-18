
var mysql=require('mysql');
var connection = mysql.createConnection({
  host     : '39.107.252.17',
  user     : 'root',
  password : 'lina2010',
  database : 'WeiWeiStock'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

connection.end();
