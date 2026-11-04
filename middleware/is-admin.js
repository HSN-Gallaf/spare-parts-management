const isAdmin = (req, res, next) => {
  if (req.session.user.role === "admin") return next();

  res.redirect("/");
};

module.exports = isAdmin;
