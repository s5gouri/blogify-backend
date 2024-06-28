//from dependencies
const express = require("express");
const multer = require("multer");
const rt1 = express.Router();

//from files
const { check_for_user } = require("../middlewares/authentication");
const { USER } = require("../models/user_schema");
const { BLOG } = require("../models/blog_schema");

//for storing images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./public/profile`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

//routes
rt1.get("/demo", async (req, res) => {
  const blogs = await BLOG.find({}).populate("created_by");

  res.render("demo", { blogall: blogs });
});
rt1.get("/", check_for_user("token"), async (req, res) => {
  const blogs = await BLOG.find({}).populate("created_by");
  res.render("home", { user: req.user, blogall: blogs });
});
rt1
  .route("/signin")
  .get((req, res) => {
    res.render("signin");
  })
  .post(async (req, res) => {
    const { EMAIL, PASSWORD } = req.body;
    try {
      const user_token = await USER.match_password_and_generate_token(
        EMAIL,
        PASSWORD
      );

      res.cookie("token", user_token).redirect("/user");
    } catch (error) {
      return res.render("signin", { error: "INCORRECT EMAIL OR PASSWORD" });
    }
  });
rt1
  .route("/signup")
  .get((req, res) => {
    res.render("signup");
  })
  .post(upload.single("PROFILEIMG"), async (req, res) => {
    const { NAME, EMAIL, PASSWORD } = req.body;
    try {
      if (req.file === undefined) {
        const user = await USER.create({
          name: NAME,
          email: EMAIL,
          password: PASSWORD,
        });
      } else {
        const user = await USER.create({
          name: NAME,
          email: EMAIL,
          password: PASSWORD,
          profileimg: `/profile/${req.file.filename}`,
        });
      }
    } catch (error) {
      return res.render("signup", { error: "USER ALREDY EXIST!!" });
    }

    try {
      const user_token = await USER.match_password_and_generate_token(
        EMAIL,
        PASSWORD
      );

      res.cookie("token", user_token).redirect("/user");
    } catch (error) {
      return res.render("signup");
    }
  });
rt1.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/user");
});
rt1.get("/view", check_for_user("token"), async (req, res) => {
  const user = req.user;
  const blogs = await BLOG.find({ created_by: user.id });
  res.render("userview", { user: req.user, blogs });
});

module.exports = { rt1 };
