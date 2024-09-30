// routes/quoteRoutes.js
const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');

router.get('/random', quoteController.getRandomQuote);

module.exports = router;
