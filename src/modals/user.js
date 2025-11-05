const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//never trust your request.body.
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      index: true,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    lastname: {
      type: String,
      minlength: 3,
      maxlength: 50,
    },
    emailId: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true, //mongodb create index on the emailId field automatically because of unique true.
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error('Password must be strong');
        }
      },
    },
    gender: {
      type: String,
      //validate function runs only when we create new document...
      validate(value) {
        if (!['male', 'female', 'other', 'Male', 'Female', 'Other'].includes(value)) {
          throw new Error('Gender must be either male, female or other');
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    photoUrl: {
      type: String,
      default:
        'https://cdn-icons-png.freepik.com/512/219/219988.png',
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error('Invalid photo URL');
        }
      },
    },
    about: {
      type: String,
      default: 'This is a default about of the user.',
    },
    skills: {
      type: [String],
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
      enum: ['silver', 'gold', 'platinum'],
    }, 
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign({ emailId: user.emailId, _id: user._id }, 'secret', {
    expiresIn: '1d',
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
