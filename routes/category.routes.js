const Category = require("../models/Category");

const router = require("express").Router();

router.get("/new", (req, res) => {
  res.render("category/add-category.ejs");
});

router.post("/", async (req, res) => {
  const { name, description } = req.body;

  await Category.create({
    name: name,
    description: description,
  });

  res.redirect("/categories");
});

router.get("/", async (req, res) => {
  const allCategories = await Category.find();

  res.render("category/categories-list.ejs", { categories: allCategories });
});

router.delete("/:categoryId", async (req, res) => {
  await Category.findByIdAndDelete(req.params.categoryId);
  res.redirect("/categories");
});

module.exports = router;
