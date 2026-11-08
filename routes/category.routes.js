const isSignedIn = require("../middleware/is-signed-in");
const isAdmin = require("../middleware/is-admin");
const Category = require("../models/Category");

const router = require("express").Router();

router.post("/", isSignedIn, isAdmin, async (req, res) => {
  const { name, description } = req.body;

  await Category.create({
    name: name,
    description: description,
  });

  res.redirect("/categories");
});

router.get("/", isSignedIn, isAdmin, async (req, res) => {
  const allCategories = await Category.find();

  res.render("category/categories-list.ejs", { categories: allCategories });
});

router.delete("/:categoryId", isSignedIn, isAdmin, async (req, res) => {
  await Category.findByIdAndDelete(req.params.categoryId);
  res.redirect("/categories");
});

router.get("/:categoryId", isSignedIn, isAdmin, async (req, res) => {
  const foundCategory = await Category.findById(req.params.categoryId);

  res.render("category/edit-category.ejs", { category: foundCategory });
});

router.put("/:categoryId", isSignedIn, isAdmin, async (req, res) => {
  const { name, description } = req.body;
  await Category.findByIdAndUpdate(req.params.categoryId, {
    name: name,
    description: description,
  });

  res.redirect("/categories");
});

module.exports = router;
