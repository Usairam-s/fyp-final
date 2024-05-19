import mongoose, { Schema } from "mongoose";

const userFeedbackSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
});

const Feedback = mongoose.model("Feedback", userFeedbackSchema);
export default Feedback;
