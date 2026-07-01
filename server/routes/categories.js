const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, requireAdmin } = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.use(protect, requireAdmin);

router.route("/").get(asyncHandler(getCategories)).post(asyncHandler(createCategory));
router
  .route("/:id")
  .patch(asyncHandler(updateCategory))
  .delete(asyncHandler(deleteCategory));

module.exports = router;
