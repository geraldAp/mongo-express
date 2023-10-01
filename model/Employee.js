const mongoose = require("mongoose");
const { Schema } = mongoose;
// mongo auto adds an id
const employeeSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});
// by deafault mongo will make this plural and lower case so it will become employees
module.exports = mongoose.model("Employee", employeeSchema);
