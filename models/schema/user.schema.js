const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    imgBG: {
      type: String,
    },
  },
  { timestamps: true },
);

UserSchema.pre('save', async function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  //hash password
  var hash = await bcrypt.hash(user.password, 10);

  // overwrite password
  user.password = hash;
  next();
});

module.exports = mongoose.model('user', UserSchema);
