var warehouseManageSQL = {
    add:'insert into WeiWarehouseManage(WID,Price,InputTime,InputUserID,Remark,UsedNumber) values (?,?,?,?,?,?)',
    queryAll:'SELECT * FROM person',
    deleteById:'DELETE FROM person WHERE id = ? ',
    updatePerson:'UPDATE person SET name = ?,age = ?,sex = ?,birth = ? WHERE id = ?',
    getPersonByName:'SELECT * FROM person WHERE name = ? ',
};
module.exports = warehouseManageSQL;