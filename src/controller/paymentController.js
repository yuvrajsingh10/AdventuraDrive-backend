const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: "rzp_test_UyzsgFjo5QxUwV",
  key_secret: "mBcHJFBIH5brfrXYl7hJcfC4",
});

const proceedToPayment = (paymentData) => {

  var options = {
    amount: paymentData.amount, // amount in the smallest currency unit
    currency: "INR",
  };
  instance.orders.create(options, function (err, order) {
    console.log(order);
  });
};


module.exports = {proceedToPayment}