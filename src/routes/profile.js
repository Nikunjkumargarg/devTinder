const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middlewares/auth');
const User = require('../modals/user');
const { validateProfileEditData, validatePassword } = require('../utils/validation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(500).send({ error: error.message || 'Internal server error' });
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    validateProfileEditData(req);

    const { about, skills, photourl, gender, age } = req.body;

    if (about !== undefined) req.user.about = about;
    if (skills !== undefined) req.user.skills = skills;
    if (photourl !== undefined) req.user.photourl = photourl;
    if (gender !== undefined) req.user.gender = gender;
    if (age !== undefined) req.user.age = age;

    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(500).send({ error: error.message || 'Internal server error' });
  }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
  try {
    validatePassword(req);
    const { password } = req.body;
    const isPasswordValid = await bcrypt.compare(password, req.user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    req.user.password = passwordHash;
    await req.user.save();
    res.send('Password updated successfully');
  } catch (error) {
    res.status(500).send({ error: error.message || 'Internal server error' });
  }
});

module.exports = profileRouter;
