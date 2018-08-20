var orderSQL={
	add:'insert into WeiOrder(ProductID,TypeID, OrderNO,Price,UserID,InputTime,TotalPrice,Number,IsPack,UserWeiXinID,Remark,WeiXinName)values(?,?,?,?,?,?,?,?,0,?,?,?)',
	queryAllNoPack:'SELECT wo.ID,wo.ProductID,wp.ProductName,OrderNO,wo.Price,UserID,IsBalance,wo.InputTime,TotalPrice,Number,IsPack,PackTime,UserWeiXinID,TypeID,wo.Remark,wo.WeiXinName,wpt.Remark as TypeName from WeiOrder wo LEFT JOIN WeiProduct wp ON wo.ProductID=wp.ID LEFT JOIN WeiProductImageType wpt on wo.TypeID=wpt.ID WHERE IsPack=0',
	delOrder:'delete from `WeiOrder` where ID=?',
	rebackStock:'update `WeiProductImageType` set `UsedNumber`=`UsedNumber`-(select `Number` from `WeiOrder` where `ID`=?) where `ID`=?',
	editStock:'update `WeiProductImageType` set `UsedNumber`=`UsedNumber` +? where `ID`=?',
	editOrder:'update WeiOrder set Number=?,TotalPrice=?,Remark=? where ID=?',
	queryOrderUserList:'select od.*,wu.`UserName`,wu.`WeiXinName` from ( select `UserID`,count(1) Total,sum(`Number`) TotalNumber ,sum(`TotalPrice`) TotalPrice from `WeiOrder` where `IsPack`=0 group by `UserID`) od left join `WeiUsers` wu on od.`UserID`=wu.`ID`',
	updatePack:'update `WeiOrder` set `IsPack`=?,`PackTime`=? where ID in(?)',
	insertPack:'insert into `WeiPack`(`DateTime`,`IsBalance`,UserID,`BalanceTime`,`IsPost`,`PostTime`) values(?,0,?,null,0,null)',
	insertOrderPack:'insert into WeiOrderPack (PackID,OrderID,InputTime)values ?',
	updatePost:'update `WeiOrder` set `IsPost`=?,`PostTime`=? where `UserID`=? and ID in(?) ',
	updateAllot:'update `WeiOrder` set `IsAllot`=?,`AllotTime`=? where `UserID`=? and ID in(?)',
	updateBalence:'update `WeiOrder` set `IsBalance`=?,`BalanceTime`=? where `UserID`=? and ID in(?)',
	queryPostList:'select wp.ID, DATE_FORMAT(wp.DateTime,"YYYY-MM-dd HH:ii:ss"),wp.IsBalance,wp.IsPost,wp.BalanceTime,Wp.PostTime,wu.`UserName`,wu.`WeiXinName` from WeiPack wp left join `WeiUsers` wu on wp.UserID=wu.`ID`',
	queryPostInfo:'select ID,WeiXinID,WeiXinName,`UserName` from `WeiUsers` where ID=?; select ID,Address,Name,Phone,ZipCode from `WeiUsersAddress` where `UserID`=?; select wo.*,wp.`ProductName`,wpt.`Remark` TypeName from `WeiOrder` wo left join `WeiProduct` wp on wo.`ProductID`=wp.ID left join `WeiProductImageType` wpt on wo.`TypeID`=wpt.ID where wo.ID in( select `OrderID` from `WeiOrderPack` where `PackID`=?)',
	editPost:'update WeiPack set IsPost=?,PostTime=? where ID=? ',
	addPostInfo:'insert into WeiPostInfo (CID,CName,Code,InputTime,Price)values(?,?,?,?,?)'
};
module.exports = orderSQL;