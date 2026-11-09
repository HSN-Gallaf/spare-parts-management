const isSignedIn = require("../middleware/is-signed-in");
const isAdmin = require("../middleware/is-admin");
const Category = require("../models/Category");

const router = require("express").Router();

router.post("/", isSignedIn, isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;

    await Category.create({
      name: name,
      description: description,
    });

    req.session.successAddCategoryMsg = "Category Has Been Added Successfuly";

    res.redirect("/categories");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/", isSignedIn, isAdmin, async (req, res) => {
  try {
    const allCategories = await Category.find();

    res.render("category/categories-list.ejs", {
      categories: allCategories,
      successEditCategoryMsg: req.session.successEditCategoryMsg,
      successAddCategoryMsg: req.session.successAddCategoryMsg,
    });

    req.session.successEditCategoryMsg = null;
    req.session.successAddCategoryMsg = null;
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:categoryId", isSignedIn, isAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.categoryId);
    res.redirect("/categories");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:categoryId", isSignedIn, isAdmin, async (req, res) => {
  try {
    const foundCategory = await Category.findById(req.params.categoryId);

    res.render("category/edit-category.ejs", { category: foundCategory });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/:categoryId", isSignedIn, isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    await Category.findByIdAndUpdate(req.params.categoryId, {
      name: name,
      description: description,
    });

    req.session.successEditCategoryMsg = "Category Has Been Edited Successfuly";

    res.redirect("/categories");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
