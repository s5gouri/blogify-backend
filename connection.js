const mongoose = require("mongoose");
const connected = async (url) => {
  mongoose
    .connect(url)
    .then(() => {
      console.log("CONNECTED TO MONGODB SUCCESSFULLY");
    })
    .catch((err) => {
      console.log("error is->", err);
    });
};
module.exports = { connected };
