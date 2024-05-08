import mongoose from "mongoose";

const { Schema } = mongoose;

const LostItemSchema = new Schema({
  tag: {
    type: Schema.Types.ObjectId,
    ref: "Tag",
  },
  venue: {
    type: Schema.Types.ObjectId,
    ref: "Venue",
  },
  imageUrl: {
    type: String,
    required: true,
  },
  sampleId: {
    type: String,
  },
  foundDate: {
    type: Date,
    required: true,
  },
  request: {
    type: Schema.Types.ObjectId,
    ref: "Request",
  },
  inventoryStatus: {
    type: String,
    enum: ["available", "claimed", "not claimed"],
    default: "available",
  },
});

const LostItem = mongoose.model("LostItem", LostItemSchema);
export default LostItem;
