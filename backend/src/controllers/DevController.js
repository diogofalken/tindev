const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
  async store(req, res) {
    const { username } = req.body;

    // Check if user already exists in DB
    const userExists = await Dev.findOne({ user: username });

    if (userExists) {
      return res.json(userExists);
    }

    // Get information on Github api
    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const { name, bio, avatar_url: avatar } = response.data;

    // Create Dev on DB
    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    });

    // Return the dev that was just created
    return res.json(dev);
  }
};
