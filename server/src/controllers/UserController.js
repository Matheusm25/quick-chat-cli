const connection = require('../database/connection');

module.exports = {
  // Log in
  async create(req, res) {
    const {
      username,
      password,
      socketId,
    } = req.body;

    const user = await connection('users')
      .select('*')
      .where({ username })
      .first();

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        error: 'Cannot find user',
      });
    }

    if (user.password === password) {
      await connection('users')
        .update({
          available: true,
          socketId,
        })
        .where({ username });
      return res.status(200).send();
    }
    return res.status(401).json({
      error: 'Invalid password',
    });
  },

  // Log off
  async delete(req, res) {
    const {
      username,
    } = req.body;

    const user = await connection('users')
      .select('*')
      .where({ username })
      .first();

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        error: 'Cannot find user',
      });
    }

    if (user.available) {
      await connection('users')
        .update({
          available: false,
          socketId: '',
        })
        .where({ username });
    }

    return res.status(204).send();
  },

  // Create user
  async store(req, res) {
    const { username, password } = req.body;

    // Check if user already exists
    const possibleUser = await connection('users')
      .select('*')
      .where({ username })
      .first();

    if (possibleUser) {
      return res.status(409).json({
        error: 'User alread exists',
      });
    }

    await connection('users').insert({
      username,
      password,
      available: false,
    });

    return res.status(201).send();
  },
};
