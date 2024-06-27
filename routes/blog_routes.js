//from dependencies
const express = require("express");
const rt2 = express.Router();
const multer = require("multer");

//from files
const { check_for_user } = require("../middlewares/authentication");
const { BLOG } = require("../models/blog_schema");
const { COMMENT } = require("../models/comments_schema");
rt2.use(check_for_user("token"));

//for storing images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./public/uploads`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

//routes
rt2.get("/", check_for_user("token"), (req, res) => {
  res.render("addblog", { user: req.user });
});
rt2.post(
  "/add",
  upload.single("COVERPAGE"),
  check_for_user("token"),
  async (req, res) => {
    const { TITLE, BODY } = req.body;
    let a;
    if (req.file === undefined) {
      a = "nope";
    } else {
      a = `/uploads/${req.file.filename}`;
    }
   
    await BLOG.create({
      title: TITLE,
      body_text: BODY,
      cover_img_url: a,
      created_by: req.user.id,
    });
    res.redirect("/user");
  }
);
rt2.get("/view/:id", check_for_user("token"), async (req, res) => {
  const Blog = await BLOG.findById(req.params.id).populate("created_by");
  const comments = await COMMENT.find({ blog: req.params.id }).populate("user");
  res.render("blog", { user: req.user, blog: Blog, comments: comments });
});
rt2.post("/com/:blogid", check_for_user("token"), async (req, res) => {
  const { blog_comment } = req.body;
  await COMMENT.create({
    comment: blog_comment,
    user: req.user._id,
    blog: req.params.blogid,
  });
  res.redirect(`/blog/view/${req.params.blogid}`);
});
module.exports = { rt2 };
