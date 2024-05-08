import LostItem from "../models/lostitem.model.js";
import Venue from "../models/venue.model.js";
import Tag from "../models/tag.model.js";
import mongoose from "mongoose";
import Request from "../models/request.model.js";

export const getSingleImage = async (req, res) => {
  const { id } = req.params;
  const image = await LostItem.findOne({ sampleId: id });
  res.json(image.imageUrl);
};

export const saveRequest = async (req, res) => {
  try {
    const {
      date,
      description,
      name,
      email,
      imageUrl,
      label,
      mappingUrl,
      sampleId,
      venues,
    } = req.body;

    //find mapping doc
    const lostItemDoc = await LostItem.findOne({ imageUrl: mappingUrl });
    const lostItemId = lostItemDoc._id;

    const getTag = await Tag.findOne({ name: label });
    const tagId = getTag._id;

    const venueIds = venues.map(
      (venueId) => new mongoose.Types.ObjectId(venueId)
    );

    // Create a new request instance
    const newRequest = new Request({
      name: name,
      email: email,
      tag: tagId,
      description: description,
      lostDate: date,
      imageUrl: imageUrl,
      sampleId: sampleId,
      venues: venueIds,
      lostItem: lostItemId,
      sampleId,
    });

    // Save the new request to the database
    await newRequest.save();

    // Return a success response
    return res.status(201).json({
      message: "Request saved successfully",
      trackid: newRequest._id,
      status: newRequest.status,
    });
  } catch (error) {
    // Handle any errors and return an error response
    console.error("Error saving request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const checkStat = async (req, res) => {
  const { id } = req.params;
  const request = await Request.findById(id);
  res.status(200).json({ request });
};

export async function allRequests(req, res) {
  const requests = await Request.find();
  res.status(200).json(requests);
}

export async function noImageRequest(req, res) {
  const { email, name, venues, lostDate, description, lostItemImageUrl } =
    req.body;

  //find mapping doc
  const lostItemDoc = await LostItem.findOne({ imageUrl: lostItemImageUrl });
  const lostItemId = lostItemDoc._id;

  const venueIds = venues.map(
    (venueId) => new mongoose.Types.ObjectId(venueId)
  );

  //save the request
  const request = new Request({
    email: email,
    name: name,
    venues: venueIds,
    lostDate: lostDate,
    description: description,
    lostItem: lostItemId,
  });
  try {
    await request.save();
    return res.status(201).json({
      message: "Request saved successfully",
      trackid: request._id,
      status: request.status,
    });
  } catch (err) {
    console.log("Error in saving the lost item to database");
    return res.status(400).json({ error: err });
  }
}

export async function getSingleRequest(req, res) {
  const id = req.params.id;
  const request = await Request.findById(id);
  const tagName = await Tag.findById(request.tag);
  const venues = request.venues; // Assuming venues is an array of venue IDs
  const venueNames = await Promise.all(
    venues.map(async (venueId) => {
      const venue = await Venue.findById(venueId);
      return venue ? venue.name : null; // Return the name if found, otherwise null
    })
  );
  const lostitem = await LostItem.findById(request.lostItem);
  const lostitemTag = await Tag.findById(lostitem.tag);
  const lostitemVenue = await Venue.findById(lostitem.venue);
  res.status(200).json({
    request,
    tagName,
    venueNames,
    lostitem,
    lostitemTag,
    lostitemVenue,
  });
}

export const acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { status: "approved" }, // Update status to approved
      { new: true }
    );
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    // Find the request by ID and update its status to "rejected"
    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { status: "rejected" },
      { new: true }
    );

    // Check if the request exists and return updated data
    if (updatedRequest) {
      res.json(updatedRequest);
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  } catch (error) {
    // Handle errors
    console.error("Error rejecting request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
