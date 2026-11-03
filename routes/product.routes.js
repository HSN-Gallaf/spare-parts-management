const Category = require("../models/Category");
const Product = require("../models/Product");

const router = require("express").Router();

// Create Routes
router.get("/new", async (req, res) => {
  const categories = await Category.find();

  res.render("product/add-product.ejs", { categories: categories });
});

router.post("/", async (req, res) => {
  const { name, price, imageUrl, categoryId } = req.body;

  await Product.create({
    name: name,
    price: price,
    imageUrl: imageUrl,
    owner: req.session.user._id,
    categoryId: categoryId,
  });

  res.redirect("/products");
});

// View Routes
router.get("/", async (req, res) => {
  const allProducts = await Product.find().populate("owner categoryId");

  res.render("product/products-list.ejs", { products: allProducts });
});

router.get("/my-products", async (req, res) => {
  const myProducts = await Product.find({ owner: req.session.user._id });

  res.render("product/garage-products.ejs", { myProducts: myProducts });
});

// Edit Routes
router.get("/:productId", async (req, res) => {
  const foundProdcut = await Product.findById(req.params.productId).populate(
    "categoryId",
  );

  const categories = await Category.find();

  res.render("product/edit-product.ejs", {
    product: foundProdcut,
    categories: categories,
  });
});

router.put("/:productId", async (req, res) => {
  const { name, price, imageUrl, categoryId } = req.body;

  await Product.findByIdAndUpdate(req.params.productId, {
    name: name,
    price: price,
    imageUrl: imageUrl,
    categoryId: categoryId,
  });

  res.redirect("/products/my-products");
});

router.delete("/:productId", async (req, res) => {
  await Product.findByIdAndDelete(req.params.productId);

  res.redirect("/products/my-products");
});

module.exports = router;
