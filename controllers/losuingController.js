
const Lousuing = require('../models/losuing.js');

exports.getRandomLosuingAPI = async (req, res) => {
  try {
    const count = await Lousuing.countDocuments();
    const random = Math.floor(Math.random() * count);
    const lousuing = await Lousuing.findOne().skip(random);
    if (!lousuing) {
      return res.status(404).send('No lousuing found');
    }
    res.json(lousuing);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.getRandomLosuing = async () => {
    try {
      const count = await Lousuing.countDocuments();
      const random = Math.floor(Math.random() * count);
      const lousuing = await Lousuing.findOne().skip(random);
      if (!lousuing) {
        return false;
      }
      return lousuing;
    } catch (error) {
      return error;
    }
  };
