import express from "express";
const router = express.Router();
import {
  getSingleImage,
  saveRequest,
  checkStat,
  allRequests,
  noImageRequest,
  getSingleRequest,
  acceptRequest,
  rejectRequest,
} from "../controllers/request.controller.js";

router.get("/getsingleimage/:id", getSingleImage);
router.post("/request/savedata", saveRequest);
router.get("/checkstatus/:id", checkStat);
router.get("/allrequests", allRequests);
router.post("/request/noimage", noImageRequest);
router.get("/request/:id", getSingleRequest);
router.put("/request/:id/accept", acceptRequest);
router.put("/request/:id/reject", rejectRequest);

export default router;
