const { model, Schema } = require("mongoose");
const comment_schema = new Schema(
  {
    comment: {
      type: String,
      require: true,
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: "BLOG_M",
      require: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "USER_M",
      require: true,
    },
  },
  { timestamps: true , collection: "commments" }
);
const COMMENT = model("COMMENT_M", comment_schema);

module.exports = { COMMENT };
