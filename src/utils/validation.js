const validator = require('validator');

const validateSignUpData = (req) => {
  const { firstname, lastname, emailId, password } = req.body;
  if (!firstname || !lastname) {
    throw new Error('Please enter the name');
  } else if (firstname.length < 3 || firstname.length > 50) {
    throw new Error('Name must be between 3 and 50 characters');
  } else if (lastname.length < 3 || lastname.length > 50) {
    throw new Error('Name must be between 3 and 50 characters');
  } else if (!validator.isEmail(emailId)) {
    throw new Error('Invalid email');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('Password must be strong');
  }
};

const validateProfileEditData = (req) => {
  const { about, skills, photourl, gender, age } = req.body;
  if (about) {
    validator.isLength(about, { min: 10, max: 1000 });
  }
  if (skills) {
    validator.array(skills, { min: 1, max: 10 });
  }
  if (photourl) {
    validator.isURL(photourl);
  }
  if (gender) {
    validator.isIn(gender, ['male', 'female', 'other', 'Male', 'Female', 'Other']);
  }
  if (age) {
    validator.isInt(age, { min: 18, max: 100 });
  }
};

const validatePassword = (req) => {
  const { password } = req.body;
  if (!validator.isStrongPassword(password)) {
    throw new Error('Password must be strong');
  }
};

module.exports = { validateSignUpData, validateProfileEditData, validatePassword };
