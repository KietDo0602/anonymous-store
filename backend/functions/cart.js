let getData = require('../functions/getters');
let costs = require("./checkout");
const UserModel = require("../models/userModel");
const mongoose = require('mongoose');

// --- Cart Operations ---
// Note: calculateTotalCost is used to keep total updated on cart screen

// adds product to cart, helper to addQuantity();
async function addToCart (cart, product) {
    let {name, _id, price} = product;
    cart.cart.push({name: name, _id: _id, price: price, quantity: 1});
    await UserModel.cartUpdate(cart);
    await costs.calculateTotalCost(cart);
}

// For direct remove from cart button and as a helper to removeQuantity
async function removeFromCart (cartId, productId) {
    let cart = await getData.getUser(cartId);
    let idx = cart.cart.findIndex((product) => product._id.equals(productId));
        if (idx > -1) {
            console.log("the code gets to here"); // means target found in cart 
            await cart.cart.splice(idx, 1); // delete the target 
            await UserModel.cartUpdate(cart); 
            await costs.calculateTotalCost(cart);
        }
}

// use the functions below in cart page for the +/- quantity buttons as needed
// a direct use of removeFromCart for the button is necessary
async function addQuantity (cartId, productId) {
    let cart = await getData.getUser(cartId);
    let product = cart.cart.find((item) => item._id.equals(productId));
    // if product isnt already in cart, add it to cart
    if (!product) {
        product = await getData.getItem(productId);
        //normally the button is tied to a product id, so there isnt a need to verify a product, but
        // we have this line just in case
        if (product) await addToCart(cart, product);
    } else {
    product.quantity += 1;
    //update the cart
    await UserModel.cartUpdate(cart);
    }
    let total = await costs.calculateTotalCost(cart);
    return total;
}


async function removeQuantity (cartId, productId) {
    let cart = await getData.getUser(cartId);
    let product = cart.cart.find((product) => product._id.equals(productId));
    if (product) {
        product.quantity -= 1;
        if (product.quantity <= 0) {
            await removeFromCart(cartId, productId);
            return;
        }
    }
    await UserModel.cartUpdate(cart);
    let total = await costs.calculateTotalCost(cart)
    return total;
}
//-----------------------------------
exports.addQuantity = addQuantity;
exports.removeQuantity = removeQuantity;
exports.removeFromCart = removeFromCart;