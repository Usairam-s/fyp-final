import LostItem from "../models/lostitem.model.js";
import Tag from "../models/tag.model.js";
import Venue from "../models/venue.model.js";
export const saveLostItem = async (req, res) => {
  const { label, sampleId, imageUrl, venue, date } = req.body;

  // Find the tag document based on the provided name
  const tag = await Tag.findOne({ name: label });

  // Find the venue document based on the provided name
  const ven = await Venue.findOne({ name: venue });

  const lostItem = new LostItem({
    tag: tag._id,
    venue: ven._id,
    imageUrl: imageUrl,
    sampleId: sampleId,
    foundDate: date,
  });
  try {
    await lostItem.save();
    return res.status(201).json(lostItem);
  } catch (err) {
    console.log("Error in saving the lost item to database");
    return res.status(400).json({ error: err });
  }
};

export const lostItemClaim = async (req, res) => {
  try {
    const lostItemId = req.params.id;
    const updatedLostItem = await LostItem.findByIdAndUpdate(
      lostItemId,
      { inventoryStatus: "claimed" }, // Update inventory status to claimed
      { new: true }
    );
    res.json(updatedLostItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
