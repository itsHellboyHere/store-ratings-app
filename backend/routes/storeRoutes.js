const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const { getStores, getStoreDetails, ownerDashBoardDetails, rateStore } = require("../controllers/storeController");

const router = express.Router();

// Normal Users - Role USER
router.get("", authenticate, getStores);
router.get("/:id", authenticate, getStoreDetails);
router.post("/:id/rate", authenticate, authorize(["USER"]), rateStore);

// Store Owner - Role OWNER
router.get("/owner/dashboard", authenticate, authorize(["OWNER"]), ownerDashBoardDetails);

module.exports = router;