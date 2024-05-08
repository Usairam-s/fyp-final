import Venue from "../models/venue.model.js";

export const getAllVenues = async (req, res) => {
  const venues = await Venue.find();
  res.status(200).json(venues);
};

export const createVenue = async (req, res) => {
  const { name } = req.body;
  const newVenue = new Venue({ name });
  await newVenue.save();
  res.status(201).json(newVenue);
};
