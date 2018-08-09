var userSQL={
	add:" insert into WeiUsers ( LoginName,WeiXinID,WeiXinName,UserName,`PassWord`,InputTime) values(null,?,?,?,null,?) ",
	addAddress:" insert into `WeiUsersAddress`(UserID,Address,`Name`,Phone,ZipCode,InputTime)values(?,?,?,?,?,?) ",
	queryAll:" select ID,WeiXinID,WeiXinName,UserName from `WeiUsers` order by ID DESC ",
	queryAllByName:" select ID,WeiXinID,WeiXinName,UserName from `WeiUsers` where WeiXinName like ? order by ID DESC "
};
module.exports = userSQL;