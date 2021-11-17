const router = require('express').Router();
let User = require('../models/userModel');
let Item = require('../models/itemModel');
let cart = require('../functions/cart');
let costs = require("../functions/checkout");
let getData = require('../functions/getters');
const mongoose = require('mongoose')

// get TESTED
router.route('/').get((req, res) => {
    User.find()
    .then(users => res.json(users))
    .catch(error => res.status(400).json(`Error msg: ${error}`))
})

// Tested
router.route('/get/:id').get((req, res) => {
    User.get(req.params.id)
    .then(users => res.json(users))
    .catch(error => res.status(400).json(`Error msg: ${error}`))
})


// post new user (registration) //TESTED
router.route('/add').post((req, res) => {
    const email = req.body.email
    const username = req.body.username 
    const password = req.body.password 

    const newUser = new User.model({
        email: email,
        username: username,
        password: password,
        products: [],
        cart: []
    })

    newUser.save()
    .then(() => res.send('User added'))
    .catch(error => res.status(400).send(`Error: ${error}`))
})

// login // Tested
router.route('/login').post( async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if email and password are valid 
        if (!(email)) {
            res.status(400).send("Missing email address");
        } else if (!(password)) {
            res.status(400).send("Missing password");
        }

        const user = await User.model.findOne({ email: email });
        // user exists and password == password in db then log in 
        if (user && password === user.password) {
            res.status(200).json(user);
            return;
        }
        res.status(400).send("Invalid Email or Password");
    } catch (err) {
        console.log(err);
        return;
    }
})

// add 1 of item to cart
router.route('/addItem').post(async (req, res) => {
    try{
        let { userId, productId } = req.body;
        await cart.addQuantity(userId, productId)
        res.status(200).send('Item added to cart')
    } catch (error) {
        console.log(error)
        res.status(400).send(`Error: ${error}`)
    }
})
// remove 1 of item from cart
router.route('/removeItem').post((req, res) => {
    let { userId, productId } = req.body;
    cart.removeQuantity(userId, productId)
    .then(() => res.status(200).send('Item removed to cart'))
    .catch(error => res.status(400).send(`Error: ${error}`))
})
// remove all of an item from cart
router.route('/removeAll').post((req, res) => {
    let { userId, productId } = req.body;
    cart.removeFromCart(userId, productId)
    .then(() => res.status(200).send('Items removed to cart'))
    .catch(error => res.status(400).send(`Error: ${error}`))
})

// total
router.route('/total').post( async (req, res) => {
    try {
        let { userId } = req.body;

        if (!userId) {
            return res.status(400).send(`Error`);
        }
        let tax = 0;
        let total = await costs.calculateTotalCost(userId)
        tax = await costs.calculateTax(total);
        res.status(200).json({total: total, plusTax: tax})
    } catch (error) {
        console.log(error);
        res.status(400).send(`Error: ${error}`);
    }
})

//checkout
router.route('/checkout').post((req, res) => {
    let { userId } = req.body;
    costs.checkout(userId)
    .then(() => res.status(200).send('purchase successful'))
    .catch(error => res.status(400).send(`Error: ${error}`))
})


// delete both user and its properties
router.route('/delete/:id').delete(async (req, res) => {
    let users
    try {
    //let users;
    let tempUser = await getData.getUser(req.params.id) //gets the user data
    while (tempUser.products.length > 0) { //loop to handle each product user sells
            let tempItem = tempUser.products[0]
            let image = await Item.get(tempItem._id)
            image = image.img
            users = await User.findByCartItem(tempItem._id);
            console.log(users);
             // finds users with product in thier cart
            // removes user to be deleted's items from carts of other users
            for (let j = 0; j < users.length; j++) await cart.removeFromCart(users[j]._id, tempItem._id);
        // deletes item
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {bucketName: 'uploads'});
        await bucket.delete(mongoose.Types.ObjectId(image));
        await Item.model.findByIdAndDelete(tempItem._id);
        tempUser.products.splice(0, 1)
    }
    await User.model.findByIdAndDelete(req.params.id) // deletes user
    res.json('User deleted')
    } catch (error) { 
        console.log(error);
        res.status(400).json(`Error: ${error}`)
    }
})


module.exports = router;

// also, if api running fails due to "imports cannot {something} outside of module"
//     instead use "const {insert name here} = requires(path)" 
//     and put {insert name here}. before imported functions