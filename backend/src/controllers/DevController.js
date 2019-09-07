const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
  async index(req, res) {
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);

    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } }
      ]
    });

    // Log message
    console.log(`Listing users that ${loggedDev.name} didn't like or dislike.`);

    return res.json(users);
  },

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

    // Log message
    console.log(`User ${dev.name} was created.`);

    // Return the dev that was just created
    return res.json(dev);
  }
};
