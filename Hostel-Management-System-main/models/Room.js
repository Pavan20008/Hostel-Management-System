const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Single', 'Double', 'Triple']
  },
  capacity: {
    type: Number,
    required: true,
    default: 2
  },
  occupants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Maintenance'],
    default: 'Available'
  },
  floor: {
    type: Number,
    required: true
  },
  block: {
    type: String,
    required: true
  },
  roomType: {
    type: String,
    enum: ['AC', 'Non-AC'],
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema); 