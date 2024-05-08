import express from "express";
const router = express.Router();
import { getAllVenues, createVenue } from "../controllers/venue.controller.js";

router.get("/venues", getAllVenues);
router.post("/createvenue", createVenue);

export default router;
