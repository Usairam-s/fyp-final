import mongoose from "mongoose";

const { Schema } = mongoose;

const TagSchema = new Schema({
  name: {
    type: String,
  },
});

const Tag = mongoose.model("Tag", TagSchema);
export default Tag;
