import mongoose from "mongoose";

const { Schema } = mongoose;

const VenueSchema = new Schema({
  name: {
    type: String,
  },
});

const Venue = mongoose.model("Venue", VenueSchema);
export default Venue;
