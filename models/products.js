const { lowerCase } = require("lodash");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  searchTitle: {
    type: String,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  reviews: {
    rate: Number,
    counts: Number,
  },
});

// A Mongoose pre-save hook to automatically fill it in
// whenever you create or update a product
ProductSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.searchTitle = this.title; // Mongoose will automatically lowercase it!
  }
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
