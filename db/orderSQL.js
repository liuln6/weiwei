var orderSQL={
	add:'insert into WeiOrder(ProductID,TypeID, OrderNO,Price,UserID,InputTime,TotalPrice,Number,IsPack,UserWeiXinID,Remark,WeiXinName,OrderStatu)values(?,?,?,?,?,?,?,?,0,?,?,?,30)',
	queryAllNoPack:'SELECT wo.ID,wo.ProductID,wp.ProductName,OrderNO,wo.Price,UserID,IsBalance,wo.InputTime,TotalPrice,Number,IsPack,PackTime,UserWeiXinID,TypeID,wo.Remark,wo.WeiXinName,wpt.Remark as TypeName from WeiOrder wo LEFT JOIN WeiProduct wp ON wo.ProductID=wp.ID LEFT JOIN WeiProductImageType wpt on wo.TypeID=wpt.ID WHERE IsPack=0 and OrderStatu=30',
	delOrder:'update `WeiOrder` set OrderStatu=18 where ID=?',
	updateOrderStatu:'update `WeiOrder` set OrderStatu=19 where ID=?',
	//删除状态 18
	//退单    19
	rebackStock:'update `WeiProductImageType` set `UsedNumber`=`UsedNumber`-(select `Number` from `WeiOrder` where `ID`=?) where `ID`=?',
	editStock:'update `WeiProductImageType` set `UsedNumber`=`UsedNumber` +? where `ID`=?',
	editOrder:'update WeiOrder set Number=?,TotalPrice=?,Remark=? where ID=?',
	queryOrderUserList:'select od.*,wu.`UserName`,wu.`WeiXinName` from ( select `UserID`,count(1) Total,sum(`Number`) TotalNumber ,sum(`TotalPrice`) TotalPrice from `WeiOrder` where `IsPack`=0 and OrderStatu=30 group by `UserID`) od left join `WeiUsers` wu on od.`UserID`=wu.`ID`',
	updatePack:'update `WeiOrder` set `IsPack`=?,`PackTime`=? where ID in(?)',
	insertPack:'insert into `WeiPack`(`DateTime`,`IsBalance`,UserID,`BalanceTime`,`IsPost`,`PostTime`,TotalNumber,TotalPrice,TotalOrderNumber,TotalPriceActive,PackStatu) values(?,0,?,null,0,null,?,?,?,0,30)',
	insertOrderPack:'insert into WeiOrderPack (PackID,OrderID,InputTime)values ?',
	updateAllot:'update `WeiOrder` set `IsAllot`=?,`AllotTime`=? where `UserID`=? and ID in(?)',
	updateBalence:'update `WeiOrder` set `IsBalance`=?,`BalanceTime`=? where `UserID`=? and ID in(?)',
	queryPostList:'select wp.ID,wp.`UserID`, DATE_FORMAT(wp.DateTime,"%Y-%m-%d") DateTime,wp.IsBalance,wp.IsPost,wp.BalanceTime,wp.`PostTime`,wp.TotalNumber,wp.TotalOrderNumber,wp.TotalPrice,wp.TotalPriceActive,wp.PackStatu,wu.`UserName`,wu.`WeiXinName` from WeiPack wp left join `WeiUsers` wu on wp.UserID=wu.`ID`',
	queryPostInfo:'select wu.ID,wu.WeiXinID,wu.WeiXinName,wu.UserName,wp.`IsPost`,wp.`IsBalance`,DATE_FORMAT(wp.PostTime,"%Y-%m-%d") PostTime,DATE_FORMAT(wp.BalanceTime,"%Y-%m-%d"),wp.PackStatu BalanceTime,TotalPriceActive from `WeiUsers` wu left join `WeiPack` wp on wu.ID=wp.`UserID` and wp.`ID`=? where wu.ID=?; select ID,Address,Name,Phone,ZipCode from `WeiUsersAddress` where `UserID`=?; select wo.*,wp.`ProductName`,wpt.`Remark` TypeName from `WeiOrder` wo left join `WeiProduct` wp on wo.`ProductID`=wp.ID left join `WeiProductImageType` wpt on wo.`TypeID`=wpt.ID where wo.ID in( select `OrderID` from `WeiOrderPack` where `PackID`=?)',
	editPost:'update WeiPack set IsPost=?,PostTime=? where ID=? ',
	editBalance:'update WeiPack set IsBalance=?,BalanceTime=?,TotalPriceActive=? where ID=? ',
	addPostInfo:'insert into WeiPostInfo (CID,CName,Code,InputTime,Price)values(?,?,?,?,?)'
};
module.exports = orderSQL;