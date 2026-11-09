const isGarageOrAdmin = require("../middleware/is-garage-admin");
const isSignedIn = require("../middleware/is-signed-in");
const Category = require("../models/Category");
const Product = require("../models/Product");
const multer = require("multer");

const router = require("express").Router();

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
let upload = multer({ storage: storage });

// Create Routes
router.post(
  "/",
  isSignedIn,
  isGarageOrAdmin,
  upload.single("imageUrl"),
  async (req, res) => {
    try {
      const { name, price, categoryId } = req.body;
      const imagePath = req.file ? req.file.filename : "";

      req.session.successAddProductMsg = "Product Has Been Added Successfuly";

      await Product.create({
        name: name,
        price: price,
        imageUrl: imagePath,
        owner: req.session.user._id,
        categoryId: categoryId,
      });

      res.redirect("/products");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
);

// View Routes
router.get("/", isSignedIn, async (req, res) => {
  try {
    const allProducts = await Product.find().populate("owner categoryId");
    const categories = await Category.find();

    res.render("product/products-list.ejs", {
      products: allProducts,
      categories: categories,
      successAddProductMsg: req.session.successAddProductMsg,
      successAddCartMsg: req.session.successAddCartMsg,
    });
    req.session.successAddProductMsg = null;
    req.session.successAddCartMsg = null;
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/my-products", isSignedIn, isGarageOrAdmin, async (req, res) => {
  try {
    const myProducts = await Product.find({
      owner: req.session.user._id,
    }).populate("categoryId");
    const categories = await Category.find();

    res.render("product/garage-products.ejs", {
      myProducts: myProducts,
      categories: categories,
      successDeleteMsg: req.session.successDeleteMsg,
      successEditProductMsg: req.session.successEditProductMsg,
    });
    req.session.successDeleteMsg = null;
    req.session.successEditProductMsg = null;
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Edit Routes
router.get("/:productId", isSignedIn, isGarageOrAdmin, async (req, res) => {
  try {
    const foundProdcut = await Product.findById(req.params.productId).populate(
      "categoryId",
    );

    const categories = await Category.find();

    res.render("product/edit-product.ejs", {
      product: foundProdcut,
      categories: categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.put(
  "/:productId",
  isSignedIn,
  isGarageOrAdmin,
  upload.single("imageUrl"),
  async (req, res) => {
    try {
      const { name, price, categoryId } = req.body;
      const imagePath = req.file ? req.file.filename : "";

      if (imagePath) {
        await Product.findByIdAndUpdate(req.params.productId, {
          name: name,
          price: price,
          imageUrl: imagePath,
          categoryId: categoryId,
        });
      } else {
        await Product.findByIdAndUpdate(req.params.productId, {
          name: name,
          price: price,
          categoryId: categoryId,
        });
      }

      req.session.successEditProductMsg = "Product Has Been Edited Successfuly";

      res.redirect("/products/my-products");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
);

router.delete("/:productId", isSignedIn, isGarageOrAdmin, async (req, res) => {
  try {
    const foundProduct = await Product.findById(req.params.productId);

    // >>>>>>>>>>Add delete the image from the folder<<<<<<<<<<<<<<

    if (!foundProduct.owner.equals(req.session.user._id)) {
      return res.status(403).send("You are not allowed to delete this Product");
    }

    await Product.findByIdAndDelete(req.params.productId);

    req.session.successDeleteMsg = "Product deleted successfully!";

    res.redirect("/products/my-products");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
