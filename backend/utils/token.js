const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'pridefitgym_secret_key_2026', {
    expiresIn: '7d',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'pridefitgym_secret_key_2026');
};

module.exports = { generateToken, verifyToken };
