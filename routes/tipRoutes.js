// routes/tipRoutes.js
const express = require('express');
const router = express.Router();
const tipController = require('../controllers/tipController');

router.get('/random', tipController.getRandomTip);

module.exports = router;
