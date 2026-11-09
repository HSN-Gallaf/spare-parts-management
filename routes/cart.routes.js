const isSignedIn = require("../middleware/is-signed-in");
const Cart = require("../models/Cart.js");

const router = require("express").Router();

router.get("/", isSignedIn, async (req, res) => {
  try {
    const myCart = await Cart.findOne({
      owner: req.session.user._id,
    }).populate("cartProducts");

    res.render("cart/cart-products.ejs", {
      cart: myCart,
      successDeleteCartMsg: req.session.successDeleteCartMsg,
    });

    req.session.successDeleteCartMsg = null;
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/:productId/add-to-cart", isSignedIn, async (req, res) => {
  try {
    const userCart = await Cart.findOne({ owner: req.session.user._id });

    const foundProductId = userCart.cartProducts.find(
      (product) => product._id.toString() === req.params.productId,
    );

    if (foundProductId) {
      return res.send("Product Already In Cart");
    }

    if (!userCart.owner.equals(req.session.user._id)) {
      return res.status(403).send("You are not allowed to add to this cart");
    }

    await Cart.findByIdAndUpdate(userCart._id, {
      $push: { cartProducts: req.params.productId },
    });

    req.session.successAddCartMsg =
      "Product Has Been Added To Cart Successfuly";

    res.redirect("/products");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:productId", isSignedIn, async (req, res) => {
  try {
    const userCart = await Cart.findOne({ owner: req.session.user._id });

    if (!userCart.owner.equals(req.session.user._id)) {
      return res.status(403).send("You are not allowed to delete this Product");
    }

    await Cart.findByIdAndUpdate(userCart._id, {
      $pull: { cartProducts: req.params.productId },
    });

    req.session.successDeleteCartMsg =
      "Product Has Been Delete From Cart Successfuly";

    res.redirect("/cart");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
