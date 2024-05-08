import Tag from "../models/tag.model.js";
import LostItem from "../models/lostitem.model.js";

export const getAllTags = async (req, res) => {
  const tags = await Tag.find();
  res.status(200).json(tags);
};

export const createTag = async (req, res) => {
  const { name } = req.body;
  const newTag = new Tag({ name });
  await newTag.save();
  res.status(201).json(newTag);
};

export const searchByTag = async (req, res) => {
  const query = req.query.tag;
  const getTagId = await Tag.findOne({ name: query });
  const lostItems = await LostItem.find({ tag: getTagId._id });
  res.json(lostItems);
};
