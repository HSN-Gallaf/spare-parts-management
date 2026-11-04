const { type } = require("firebase/firestore/pipelines");
const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    cartProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
