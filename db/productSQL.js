var productSQL = {
    add:'insert into WeiProduct(WID,InputTime,InputUserID,Remark,UsedNumber) values (?,?,?,?,?)',
    addImages:'insert into WeiImages(ImgUrl,InputTime,WWMID) values (?,?,?)',
    addImageType:'insert into WeiWareProductImageType(ProductID,Price,UsedNumber,TotalNumber,Status,ImageID,Remark)values(?,?,?,?,1,?,?)',
    queryAll:'select * from WeiProduct',
    queryHouseAll:'select * from WeiWarehouseType',
    deleteById:'DELETE FROM person WHERE id = ? ',
    updatePerson:'UPDATE person SET name = ?,age = ?,sex = ?,birth = ? WHERE id = ?',
    getPersonByName:'SELECT * FROM person WHERE name = ? ',
};
module.exports = productSQL;