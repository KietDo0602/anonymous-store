const ItemModel = require("../models/itemModel");
const UserModel = require("../models/userModel");
const UploadModel = require("../models/uploadsModel");

//uses id parameter to return product object, or null if corresponding product does not exist
// (may replace with randomly generated or mongoDB given id)
function getItem(id) {
    let data = (ItemModel.get(id)).exec();
    return data;
}

// uses id parameter to return cart object, or null if product does not exist
// Currently uses mongoDB generated id for parameter, although can be changed
function getUser(id) {
    let data = (UserModel.get(id)).exec();
    return data;
}

// may be removed or used during testing
/*function getImage(id) {
    let data = (UploadModel.findOne({_id: id})).exec();
    return data;
}*/

exports.getItem = getItem;
exports.getUser = getUser;
//exports.getImage = getImage;