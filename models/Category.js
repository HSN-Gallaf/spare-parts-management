const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 15,
      unique: true,
    },
    description: {
      type: String,
      minLength: 7,
      maxLength: 30,
    },
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
