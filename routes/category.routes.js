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

module.exports = router;
