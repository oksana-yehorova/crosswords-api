// controllers/quoteController.js
const Quote = require('../models/quote');

exports.getRandomQuote = async (req, res) => {
  try {
    const count = await Quote.countDocuments();
    const random = Math.floor(Math.random() * count);
    const quote = await Quote.findOne().skip(random);
    if (!quote) {
      return res.status(404).send('No quotes found');
    }
    res.json(quote);
  } catch (error) {
    res.status(500).send('Server error');
  }
};
