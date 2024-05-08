import mongoose from "mongoose";

// Define the User schema
const staffSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create the User model
const Staff = mongoose.model("Staff", staffSchema);

module.exports = Staff;
