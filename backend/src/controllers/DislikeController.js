const Dev = require('../models/Dev');

module.exports = {
  async store(req, res) {
    const { user } = req.headers;
    const { devId } = req.params;

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    // Check if the targetDev exists
    if (!targetDev) {
      return res.status(400).json({ error: 'Dev not exists' });
    }

    // Log message
    console.log(`User ${loggedDev.name} just disliked ${targetDev.name}.`);

    loggedDev.dislikes.push(targetDev._id);

    await loggedDev.save();

    return res.json(loggedDev);
  }
};
