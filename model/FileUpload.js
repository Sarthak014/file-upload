const mongoose = require("mongoose");

const schema = {
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    unique: true,
  },
  size: {
    type: Number,
  }
};

// Schema
const fileUploadSchema = new mongoose.Schema(schema, {
  collection: "FileUpload",
  timestamps: true,
});

// Model
let FileUpload = mongoose.model("FileUpload", fileUploadSchema);

module.exports = { FileUpload };
