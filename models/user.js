const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default:
      "https://res.cloudinary.com/i-make-websites/image/upload/v1600449313/201-2015100_title-or-name-here-empty-profile-clipart_wwnqzt.jpg",
  },
});

mongoose.model("User", userSchema);
