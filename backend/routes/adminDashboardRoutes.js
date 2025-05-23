const express = require("express")
const router = express.Router()
const { getDashboardStats, getAllStores, getAllUsers, getUserDetails } = require('../controllers/adminDashboardController');
const { authenticate, authorize } = require('../middleware/auth')


router.get("/dashboard", authenticate, authorize(["ADMIN"]), getDashboardStats);
router.get("/stores", authenticate, authorize(["ADMIN"]), getAllStores);
router.get("/users", authenticate, authorize(["ADMIN"]), getAllUsers);
router.get("/users/:id", authenticate, authorize(["ADMIN"]), getUserDetails);
module.exports = router