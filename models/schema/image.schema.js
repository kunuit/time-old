const mongoose = require('mongoose');

const ImgSchema = new mongoose.Schema(
  {
    idPeople: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'people',
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('image', ImgSchema);
