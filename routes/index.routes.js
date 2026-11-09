const router = require("express").Router();

router.get("/", (req, res) => {
  try {
    res.render("homepage.ejs");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
