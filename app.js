const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 5000;
const { MONGOURI } = require("./keys");

//user schema
require("./models/user");
require("./models/posts");

//routes
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/posts"));
app.use(require("./routes/user"));

//connect to db
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("connected to db");
});
mongoose.connection.on("error", (err) => {
  console.log("err connecting", err);
});

//start server
app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
