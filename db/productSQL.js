var productSQL = {
    add:'insert into WeiProduct(WID,InputTime,InputUserID,Remark,UsedNumber,TotalNumber) values (?,?,?,?,?,?)',
    addImages:'insert into WeiImages ( ImgUrl,InputTime,WWMID ) values (?,?,?) ',
    addProductImage:'insert into WeiProductImage (Remark,ImageID,ProductID ) values ? ',
    addImageType:'insert into WeiProductImageType(ProductID,Price,UsedNumber,TotalNumber,Status,ImageID,Remark)values ? ',
    queryAll:'select * from WeiProduct',
    queryHouseAll:'select * from WeiWarehouseType',
    deleteById:'DELETE FROM person WHERE id = ? ',
    updatePerson:'UPDATE person SET name = ?,age = ?,sex = ?,birth = ? WHERE id = ?',
    getPersonByName:'SELECT * FROM person WHERE name = ? ',
};
module.exports = productSQL;