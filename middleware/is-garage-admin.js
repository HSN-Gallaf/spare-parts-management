const isGarageOrAdmin = (req, res, next) => {
  if (req.session.user.role === "admin" || req.session.user.role === "garage")
    return next();

  res.redirect("/");
};

module.exports = isGarageOrAdmin;
