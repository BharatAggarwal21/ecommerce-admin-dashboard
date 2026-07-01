const express = require("express");
const { getCustomers } = require("../controllers/customerController");
const { protect, requireAdmin } = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.use(protect, requireAdmin);

router.get("/", asyncHandler(getCustomers));

module.exports = router;
