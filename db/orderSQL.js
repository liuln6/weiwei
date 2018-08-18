var orderSQL={
	add:'insert into WeiOrder(ProductID,TypeID, OrderNO,Price,UserID,IsBalance,InputTime,TotalPrice,Number,IsPack,IsPost,PostCode,BalanceTime,PackTime,PostTime,UserWeiXinID,Remark,WeiXinName)values(?,?,?,?,?,0,?,?,?,0,0,"",null,null,null,?,?,?)',
	queryAllNoPack:'SELECT wo.ID,wo.ProductID,wp.ProductName,OrderNO,wo.Price,UserID,IsBalance,wo.InputTime,TotalPrice,Number,IsPack,IsPost,PostCode,BalanceTime,PackTime,PostTime,UserWeiXinID,TypeID,wo.Remark,wo.WeiXinName,wpt.Remark as TypeName from WeiOrder wo LEFT JOIN WeiProduct wp ON wo.ProductID=wp.ID LEFT JOIN WeiProductImageType wpt on wo.TypeID=wpt.ID WHERE IsPack=0',
	delOrder:'delete from `WeiOrder` where ID=?',
	rebackStock:'update `WeiProductImageType` set `UsedNumber`=`UsedNumber`-(select `Number` from `WeiOrder` where `ID`=?) where `ID`=?',
	editStock:'update `WeiProductImageType` set `UsedNumber`=`UsedNumber` +? where `ID`=?',
	editOrder:'update WeiOrder set Number=?,TotalPrice=?,Remark=? where ID=?',
	queryOrderUserList:'select od.*,wu.`UserName`,wu.`WeiXinName` from ( select `UserID`,count(1) Total,sum(`Number`) TotalNumber ,sum(`TotalPrice`) TotalPrice from `WeiOrder` where `IsPack`=0 and IsPost =0 group by `UserID`) od left join `WeiUsers` wu on od.`UserID`=wu.`ID`'
};
module.exports = orderSQL;