var warehouseManageSQL = {
    add:'insert into WeiWarehouseManage(WID,Price,InputTime,InputUserID,Remark,UsedNumber) values (?,?,?,?,?,?)',
    addImages:'insert into WeiImages(ImgUrl,InputTime,WWMID) values ?',
    queryAll:'select * from WeiWarehouseManage',
    queryHouseAll:'select * from WeiWarehouse',
    deleteById:'DELETE FROM person WHERE id = ? ',
    updatePerson:'UPDATE person SET name = ?,age = ?,sex = ?,birth = ? WHERE id = ?',
    getPersonByName:'SELECT * FROM person WHERE name = ? ',
};
module.exports = warehouseManageSQL;