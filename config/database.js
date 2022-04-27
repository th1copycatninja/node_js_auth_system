const mongoose = require("mongoose");
const { MONGODB_URL } = process.env;

exports.connect = () => {
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("db connected successfully"))
    .catch((err) => {
      console.log(`db connection err ${err}`);
      process.exit(1);
    });
};
