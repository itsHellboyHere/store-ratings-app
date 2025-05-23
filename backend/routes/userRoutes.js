const express = require("express")
const router = express.Router()
const { changePassword } = require("../controllers/userController")
const { authenticate } = require("../middleware/auth")


router.put("/change-password", authenticate, changePassword)

module.exports = router