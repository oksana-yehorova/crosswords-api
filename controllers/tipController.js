// controllers/tipController.js
const Tip = require('../models/Tip');

exports.getRandomTip = async (req, res) => {
  try {
    const count = await Tip.countDocuments();
    const random = Math.floor(Math.random() * count);
    const tip = await Tip.findOne().skip(random);
    if (!tip) {
      return res.status(404).send('No tips found');
    }
    res.json(tip);
  } catch (error) {
    res.status(500).send('Server error');
  }
};
