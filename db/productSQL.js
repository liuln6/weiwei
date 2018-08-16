var productSQL = {
    add:'insert into WeiProduct(WID,InputTime,InputUserID,Remark,UsedNumber,TotalNumber,ProductName,Status,Width,ProductNo) values (?,?,?,?,?,?,?,30,?,?)',
    addImages:'insert into WeiImages ( ImgUrl,InputTime,WWMID ) values (?,?,?) ',
    addProductImage:'insert into WeiProductImage (Remark,ImageID,ProductID ) values ? ',
    addImageType:'insert into WeiProductImageType(ProductID,Price,UsedNumber,TotalNumber,Status,ImageID,Remark)values ? ',
    queryPouductAllForSelect:'select p.`ID` PID,p.`ProductName`,p.`Remark`,p.`TotalNumber`,p.`UsedNumber`,p.Width,(imgType.`TotalNumber`-imgType.`UsedNumber`) StockNumber,imgType.`ID` TypeID,imgType.`ImageID`,imgType.`Price`,imgType.`Remark` TypeName,imgType.`TotalNumber`,imgType.`UsedNumber`,img.`ImgUrl` from `WeiProductImageType` imgType left join `WeiProduct` p on imgType.`ProductID`=p.`ID` left join `WeiImages` img on imgType.`ImageID`=img.`ID` where imgType.TotalNumber-imgType.UsedNumber>0 and p.`Status`=30 order by p.`ID`,imgType.`ID`',
    queryProductAll:'select p.`ID` PID,p.`ProductName`,p.`Remark`,p.`TotalNumber`,p.`UsedNumber`,p.Width,(imgType.`TotalNumber`-imgType.`UsedNumber`)  StockNumber,imgType.`ID` TypeID,imgType.`ImageID`,imgType.`Price`,imgType.`Remark` TypeName,imgType.`TotalNumber`,imgType.`UsedNumber`,img.`ImgUrl` from `WeiProductImageType` imgType left join `WeiProduct` p on imgType.`ProductID`=p.`ID` left join `WeiImages` img on imgType.`ImageID`=img.`ID` where imgType.TotalNumber-imgType.UsedNumber>0 and p.`Status`=30 order by p.`ID`,imgType.`ID`',
    queryPouductAllByName:'select p.`ID` PID,p.`ProductName`,p.`Remark`,p.`TotalNumber`,p.`UsedNumber`,p.Width,(imgType.`TotalNumber`-imgType.`UsedNumber`)  StockNumber,imgType.`ID` TypeID,imgType.`ImageID`,imgType.`Price`,imgType.`Remark` TypeName,imgType.`TotalNumber`,imgType.`UsedNumber`,img.`ImgUrl` from `WeiProductImageType` imgType left join `WeiProduct` p on imgType.`ProductID`=p.`ID` left join `WeiImages` img on imgType.`ImageID`=img.`ID` where p.ProductName like ? and imgType.TotalNumber-imgType.UsedNumber>0 and p.`Status`=30 order by p.`ID`,imgType.`ID`',
    addStockList:'insert into `WeiStockList`(Number,InputTime,ProductImageTypeID,ProductID)values ?',
    queryHouseAll:'select * from WeiWarehouseType',
    minuxNumber:' update `WeiProduct` set `UsedNumber`=`UsedNumber`+? where `ID`=?  ',
    minuxNumberType:' update WeiProductImageType set UsedNumber=UsedNumber+? where ID=? ',
    queryStock:'SELECT TotalNumber-UsedNumber as StockNum from WeiProductImageType where ID=?',
    queryProductByID:'SELECT * FROM WeiProduct where ID=? ; SELECT img.ID,Remark,ImageID,ProductID,ImgUrl,InputTime from WeiProductImage as img LEFT JOIN WeiImages as i on img.ImageID=i.ID  where ProductID=? ;  SELECT tp.*,i.ImgUrl FROM WeiProductImageType as tp LEFT JOIN WeiImages as i on tp.ImageID=i.ID WHERE ProductID=? ; ',
    deleteById:'DELETE FROM person WHERE id = ? ',
    updatePerson:'UPDATE person SET name = ?,age = ?,sex = ?,birth = ? WHERE id = ?',
    getPersonByName:'SELECT * FROM person WHERE name = ? ',
    queryProductTypeListForPack:'select wo.*,wp.`ProductName`,wpt.`Remark` TypeName from (select `ProductID`,`TypeID`,count(1) Total,sum(`Number`) TotalNumber from `WeiOrder` where `IsPack`=0 group by `ProductID`,`TypeID` ) wo left join `WeiProduct` wp on wo.`ProductID`=wp.`ID`  left join `WeiProductImageType` wpt on wo.`TypeID`=wpt.`ID` ',
    queryTypeInfo:'select wpt.*,wp.`ProductName` from `WeiProductImageType` wpt left join `WeiProduct` wp on wpt.`ProductID`=wp.`ID` where wpt.ID=?;select * from `WeiOrder` where `TypeID`=?'
};
module.exports = productSQL;