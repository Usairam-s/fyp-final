import express from "express";
const router = express.Router();
import {
  getSingleImage,
  getSingleImageDash,
  saveRequest,
  checkStat,
  allRequests,
  noImageRequest,
  getSingleRequest,
  acceptRequest,
  rejectRequest,
  userFeedback,
  getAllFeedback,
  allRequestsCount,
} from "../controllers/request.controller.js";

router.get("/getsingleimage/:id", getSingleImage);
router.get("/getsingleimagedash/:id", getSingleImageDash);
router.post("/request/savedata", saveRequest);
router.get("/checkstatus/:id", checkStat);
router.get("/allrequests", allRequests);
router.get("/allrequestscount", allRequestsCount);
router.post("/request/noimage", noImageRequest);
router.get("/request/:id", getSingleRequest);
router.put("/request/:id/accept", acceptRequest);
router.put("/request/:id/reject", rejectRequest);
router.post("/userfeedback", userFeedback);
router.get("/getallfeedback", getAllFeedback);

export default router;
