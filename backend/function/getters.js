const ItemModel = require("../models/itemModel");
//const VendorModel = require("../models/");
const UserModel = require("../models/userModel");

// TESTED

//uses id parameter to return vendor object, or null if corresponding vendor does not exist
// (may replace with randomly generated or mongoDB given id)
function getVendor(id) {
    let data = (VendorModel.get(id)).exec();
    return data;
}

//uses id parameter to return product object, or null if corresponding product does not exist
// (may replace with randomly generated or mongoDB given id)
function getItem(id) {
    let data = (ItemModel.get(id)).exec();
    return data;
}

// uses id parameter to return cart object, or null if product does not exist
// Currently uses mongoDB generated id for parameter, although can be changed
function getCart(id) {
    let data = (UserModel.get(id)).exec();
    return data;
}

exports.getVendor = getVendor;
exports.getItem = getItem;
exports.getCart = getCart;