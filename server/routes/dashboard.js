const express = require("express");
const { getSummary } = require("../controllers/dashboardController");
const { protect, requireAdmin } = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/summary", protect, requireAdmin, asyncHandler(getSummary));

module.exports = router;
