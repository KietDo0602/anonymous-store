const mongoose = require('mongoose');

// add img field
const itemSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        default: 0
    },
    desc: {
        type: String,
        required: true
    }, 
    price: {
        type: Number,
        required: true
    }, 
    vendorId: {
        type: String,
        required: true
    }
})
const ItemModel = mongoose.model('Item', itemSchema);
module.exports = {
    model: ItemModel,
    // use for .get route (contains vendor id)
    find: () => ItemModel.find({}).select({name: 1, desc: 1, img: 1, price: 1, vendorId: 1, _id: 1}),
    // for .get route (does not contain vendor id)
    display: () => ItemModel.find({}).select({name: 1, desc: 1, img: 1, price: 1, _id: 1}),
    // for .get/:id route (contains vendor id)
    get: id => ItemModel.findOne({_id: id})
    .select({name: 1, desc: 1, img: 1, price: 1, vendorId: 1, _id: 1}),
    getIdByName: name => ItemModel.findOne({name: name})
    .select({_id: 1})
}