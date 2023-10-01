// creating the mongoose connection
const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    // connecting to mongo db. now we also also pass a second arg to prevent warnings from mongodb
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true, // Corrected option name
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};

module.exports = connectDb;
