var userSQL={
	queryAll:" select ID,WeiXinID,WeiXinName,UserName from `WeiUsers` order by ID DESC ",
	queryAllByName:" select ID,WeiXinID,WeiXinName,UserName from `WeiUsers` where WeiXinName like ? order by ID DESC "
};
module.exports = userSQL;