const express = require("express")
const router = express.Router()
const { signIn, signUp, logout } = require("../controllers/authController")

router.post("/sign-up", signUp)
router.post("/sign-in", signIn)
router.post('/logout', logout);

module.exports = router