require("dotenv").config();

//from files
const { rt1 } = require("./routes/user_routes");
const { connected } = require("./connection");
const { rt2 } = require("./routes/blog_routes");
connected(process.env.MONGO_URL);
const PORT = process.env.PORT || 8000;

//dependencies

const status = require("express-status-monitor");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

app.use(status())
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
  console.log(
    "SERVER STARTED AT -> http://localhost:8000/ or  http://192.168.5.161:8000/ "
  );
});
