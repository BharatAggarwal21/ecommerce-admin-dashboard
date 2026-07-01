const express = require("express");
const { getOrders, getOrder, updateOrderStatus } = require("../controllers/orderController");
const { protect, requireAdmin } = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.use(protect, requireAdmin);

router.get("/", asyncHandler(getOrders));
router.get("/:id", asyncHandler(getOrder));
router.patch("/:id", asyncHandler(updateOrderStatus));

module.exports = router;
