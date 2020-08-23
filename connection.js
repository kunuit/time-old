const mongoose = require('mongoose');

const URI = process.env.HOST_MONGO;

console.log(URI);

const connectDB = async () => {
  try {
    await mongoose.connect(URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log('db connected .   .... !');
  } catch (error) {
    console.log(error);
    console.log("don't connected");
  }
};

module.exports = connectDB;
