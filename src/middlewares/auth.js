const jwt = require('jsonwebtoken');
const User = require('../modals/user');

const userAuth = async (req, res, next) => {
  try {
    console.log('comiing');
    const token = req.cookies?.token;
    console.log('token', token);
    if (!token) {
      return res.status(401).send('Unauthorized access');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).send('Unauthorized access');
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send('Invalid or expired token');
  }
};

module.exports = userAuth;
