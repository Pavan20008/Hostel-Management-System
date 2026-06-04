const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    trim: true,
    match: [/^\d{3}[A-Z]{2}\d{4}$/, 'Please enter a valid roll number (e.g., 122CS0027)']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  userType: {
    type: String,
    required: [true, 'User type is required'],
    enum: {
      values: ['student', 'admin'],
      message: '{VALUE} is not a valid user type'
    },
    default: 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Static method to validate roll number format
userSchema.statics.isValidRollNumber = function(rollNumber) {
  const rollNumberPattern = /^\d{3}[A-Z]{2}\d{4}$/;
  return rollNumberPattern.test(rollNumber);
};

// Create a virtual for user's full identification
userSchema.virtual('fullIdentification').get(function() {
  return `${this.name} (${this.rollNumber})`;
});

// Ensure virtuals are included when converting to JSON
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password; // Remove password from JSON output
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema); 