import express from "express";
const router = express.Router();
import {
  getAllTags,
  createTag,
  searchByTag,
} from "../controllers/tag.controller.js";

router.get("/tags", getAllTags);
router.post("/createtag", createTag);
router.get("/search/", searchByTag);

export default router;
