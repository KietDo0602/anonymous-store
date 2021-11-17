const mongoose = require('mongoose');


// user schema 
// The data is is saved almost identical to this, but also contains  _id and this other value, __v when being generated

const userSchema = new mongoose.Schema({ 
    email: { // used for login 
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: { // used for login 
        type: String,
        required: true
    },
    cart: [{ // buying list of items, for details of fields see item schema
        name: {
            type: String,
            required: true
        },
        id: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    total: { // total cost of items in cart
        type: Number,
        required: true,
        default: 0.00
    },
    earnings: {  // total amount made from sales
        type: Number,
        required: true,
        default: 0.00
    },
    products: [{ // selling list of items, for details of fields see item schema
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }]
});

const UserModel = mongoose.model('User', userSchema);

module.exports = {
    model: UserModel,
    // use with .get route
    find: () => UserModel.find({}).select({email:1, username:1, password: 1, products: 1, cart: 1, earnings : 1, total: 1,  _id: 1}),
    //use to get specific user
    get: id => UserModel.findOne({_id: id})
        .select({
            _id: 1, 
            email: 1, 
            username: 1, 
            password: 1, 
            cart: {
                name: 1, 
                _id: 1, 
                price: 1, 
                quantity: 1
            }, 
            total: 1, 
            earnings: 1,
            products: {
                name: 1, 
                _id: 1, 
                price: 1
            }
        }),
     // the below updates the products and cost in the cart respectively, entirely used within functions
     cartUpdate: (userObject) => UserModel.updateOne({_id: userObject._id}, {cart: userObject.cart}),
     costUpdate: (userObject) => UserModel.updateOne({_id: userObject._id}, {total: userObject.total}),
     // Below are methods used to update earnings
     updateEarnings: (userObject) => UserModel.updateOne({_id: userObject._id}, {earnings: userObject.earnings}),
     zeroEarnings: () => UserModel.updateMany({earnings: {$gt: 0}}, {earnings: 0}), //this exists solely for testing the checkout function
     // Produces array of userIds for users that have an item in cart
     findByCartItem: id => UserModel.find({cart: { $elemMatch: {_id: id}}}).select({_id: 1}),
     updateProducts: (userObject) => UserModel.updateOne({_id: userObject._id}, {products: userObject.products}),
}