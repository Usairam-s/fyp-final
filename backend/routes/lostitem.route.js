import express from "express";
const router = express.Router();
import {
  saveLostItem,
  lostItemClaim,
} from "../controllers/lostitem.controller.js";

router.post("/lostitem/savedata", saveLostItem);
router.put("/lostitem/:id/claim", lostItemClaim);

export default router;
