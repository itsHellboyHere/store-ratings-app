const express = require("express")
const router = express.Router()
const { createUsers, createStore } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth')


router.post('/create-user', authenticate, authorize(['ADMIN']), createUsers);
router.post('/create-store', authenticate, authorize(['ADMIN']), createStore);

module.exports = router;