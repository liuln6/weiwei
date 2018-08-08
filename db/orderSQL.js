var orderSQL={
	add:'insert into WeiOrder(ProductID, OrderNO,Price,UserID,IsBalance,InputTime,TotalPrice,Number,IsPack,IsPost,PostCode,BalanceTime,PackTime,PostTime,UserWeiXinID)values(?,?,?,?,0,?,?,?,0,0,"",null,null,null,?)'
};
module.exports = orderSQL;