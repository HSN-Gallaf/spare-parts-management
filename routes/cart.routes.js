const isSignedIn = require("../middleware/is-signed-in");
const Cart = require("../models/Cart.js");

const router = require("express").Router();

router.get("/", isSignedIn, async (req, res) => {
  const myCart = await Cart.findOne({
    owner: req.session.user._id,
  }).populate("cartProducts");

  res.render("cart/cart-products.ejs", { cart: myCart });
});

router.post("/:productId/add-to-cart", isSignedIn, async (req, res) => {
  const userCart = await Cart.findOne({ owner: req.session.user._id });

  await Cart.findByIdAndUpdate(userCart._id, {
    $push: { cartProducts: req.params.productId },
  });

  res.redirect("/products");
});

module.exports = router;
