let getData = require('../functions/getters');
const UserModel = require("../models/userModel");

// calculates cost and pays vendors appropriately, helper to checkout()
async function calculateCost(cart) {
    let total = 0;
    let amount = 0;
    for (let i = 0; i < cart.cart.length; i++) {
      	amount = cart.cart[i].price * cart.cart[i].quantity;
        total += amount;
        let product = await getData.getItem(cart.cart[i]._id);
        let vendor = await getData.getUser(product.vendorId);
        vendor.earnings += amount;
        await UserModel.updateEarnings(vendor);
    }
    cart.total = total;
    await UserModel.costUpdate(cart);
    return total;
}

// Copy of above to just get the total cost, without paying vendors
// Use: for total display on checkout screen
async function calculateTotalCost(cartId) {
  let cart = await getData.getUser(cartId)
  let total = 0.00;
  let amount = 0.00;
  for (let i = 0; i < cart.cart.length; i++) {
      amount = cart.cart[i].price * cart.cart[i].quantity;
      total += amount;
  }

  cart.total = total;
  await UserModel.costUpdate(cart);
  return total;
}

// For calculating and adding on tax, currently set to 13% HST, may also use in display
function calculateTax(amount) {
  return parseFloat((amount * 1.13).toFixed(2)); // total plus Ontario Harmonial Sales Tax
}

//note: this simulates how checkout works, clearing user cart as purchase is made.
// an actual store would required interaction with inventory, user balance, etc.
async function checkout(_id) {
    let cart = await getData.getUser(_id);
    let total = await calculateCost(cart);
    cart.cart.splice(0, cart.cart.length);
    cart.total = 0;
    await UserModel.cartUpdate(cart);
    await UserModel.costUpdate(cart);
    return total;
}

exports.checkout = checkout;
exports.calculateTotalCost = calculateTotalCost;
exports.calculateTax = calculateTax;