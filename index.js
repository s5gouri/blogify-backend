require("dotenv").config();

//from files
const { rt1 } = require("./routes/user_routes");
const { connected } = require("./connection");
const { rt2 } = require("./routes/blog_routes");
connected(process.env.MONGO_URL);
const PORT = process.env.PORT || 8000;

//dependencies
const cluster = require("cluster");
const os = require("os");
const cpus = os.cpus().length;
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

//using cluster to reduce load on server

  const app = express();
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());

  app.set("view engine", "ejs");
  app.set("views", path.resolve("./views"));
  app.use(express.static(path.resolve("./public")));
  app.get("/", async (req, res) => {
    res.clearCookie("token").render("landpage");
  });

  app.use("/user", rt1);
  app.use("/blog", rt2);
  app.listen(PORT, () => {
    console.log(`SERVER STARTED with cpu-->${process.pid}`);
  });
