const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const requireLogin = require("../middleware/requireLogin");

router.get("/protected", requireLogin, (req, res) => {
  res.send("hello user");
});

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  console.log(name, email, password);
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please add all the fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "user already exists with that email" });
      }
      //encrypt password before placing in db
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
          pic,
        });

        user
          .save()
          .then((user) => {
            res.json({ message: "saved succesfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please provide email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      //return res.status(422).json({ error: "invalid username or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          //return res.json({ message: "succesful login" });
          const token = jwt.sign({ id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, pic } = savedUser;
          res.json({ token, user: { _id, name, email, pic } });
        } else {
          return res
            .status(422)
            .json({ error: "invalid username or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
