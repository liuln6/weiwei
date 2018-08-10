var userSQL={
	add:" insert into WeiUsers ( LoginName,WeiXinID,WeiXinName,UserName,`PassWord`,InputTime) values(null,?,?,?,null,?) ",
	edit:" update WeiUsers set WeiXinID=?,WeiXinName=?,UserName=? where ID=? ",
	addAddress:" insert into `WeiUsersAddress`(UserID,Address,`Name`,Phone,ZipCode,InputTime)values(?,?,?,?,?,?) ",
	editAddress:' update WeiUsersAddress set Address=?, `Name`=?,Phone=?,ZipCode=? where ID=?',
	queryAll:" select ID,WeiXinID,WeiXinName,UserName from `WeiUsers` order by ID DESC ",
	queryAllByName:" select ID,WeiXinID,WeiXinName,UserName from `WeiUsers` where WeiXinName like ? order by ID DESC ",
	queryByID:'SELECT ID,WeiXinID,WeiXinName,UserName from WeiUsers WHERE ID=? ; SELECT ID,UserID,Address,`Name`,Phone,ZipCode FROM WeiUsersAddress where UserID=? ;'
};
module.exports = userSQL;