const mongoose = require("mongoose");
const blog_schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body_text: {
      type: String,
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER_M",
      required: true,
    },
    cover_img_url: {
      type: String,
    },
  },
  { timestamps: true, collection: "blogs" }
);
const BLOG = mongoose.model("BLOG_M", blog_schema);
module.exports = { BLOG };
