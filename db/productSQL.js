var productSQL = {
    add:'insert into WeiProduct(WID,InputTime,InputUserID,Remark,UsedNumber,TotalNumber,ProductName,Status,Width) values (?,?,?,?,?,?,?,30,?)',
    addImages:'insert into WeiImages ( ImgUrl,InputTime,WWMID ) values (?,?,?) ',
    addProductImage:'insert into WeiProductImage (Remark,ImageID,ProductID ) values ? ',
    addImageType:'insert into WeiProductImageType(ProductID,Price,UsedNumber,TotalNumber,Status,ImageID,Remark)values ? ',
    queryPouductAllForSelect:'select p.`ID` PID,p.`ProductName`,p.`Remark`,p.`TotalNumber`,p.`UsedNumber`,p.Width,imgType.`ID` TypeID,imgType.`ImageID`,imgType.`Price`,imgType.`Remark`,imgType.`TotalNumber`,imgType.`UsedNumber`,img.`ImgUrl` from `WeiProductImageType` imgType left join `WeiProduct` p on imgType.`ProductID`=p.`ID` left join `WeiImages` img on imgType.`ImageID`=img.`ID` where p.TotalNumber-p.UsedNumber>0 and p.`Status`=30 order by p.`ID`,imgType.`ID`',
    addStockList:'insert into `WeiStockList`(Number,InputTime,ProductImageTypeID,ProductID)values ?',
    queryHouseAll:'select * from WeiWarehouseType',
    minuxNumber:' update WeiProduct set TotalNumber=TotalNumber-?,UsedNumber=UsedNumber+? where ProductID=? ',
    deleteById:'DELETE FROM person WHERE id = ? ',
    updatePerson:'UPDATE person SET name = ?,age = ?,sex = ?,birth = ? WHERE id = ?',
    getPersonByName:'SELECT * FROM person WHERE name = ? ',
};
module.exports = productSQL;