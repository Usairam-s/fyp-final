import mongoose from "mongoose";

const { Schema } = mongoose;

const RequestSchema = new Schema({
  name: { type: String, required: true }, //
  email: {
    type: String,
    required: true,
  },
  tag: {
    type: Schema.Types.ObjectId,
    ref: "Tag",
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  venues: [
    {
      type: Schema.Types.ObjectId,
      ref: "Venue",
    },
  ],
  sampleId: {
    type: String,
  },
  lostDate: {
    type: Date,
    required: true,
  },
  lostItem: {
    type: Schema.Types.ObjectId,
    ref: "LostItem",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const Request = mongoose.model("Request", RequestSchema);
export default Request;
