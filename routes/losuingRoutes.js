// routes/tipRoutes.js
const express = require('express');
const router = express.Router();
const losuingController = require('../controllers/losuingController');

router.get('/random', losuingController.getRandomLosuingAPI);

module.exports = router;
