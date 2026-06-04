const Room = require('../models/Room');

// Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('occupants', 'name rollNumber');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms' });
  }
};

// Get available rooms
exports.getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'available' });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available rooms' });
  }
};

// Add new room
exports.addRoom = async (req, res) => {
  try {
    const { roomNumber, floor, capacity, roomType, price } = req.body;
    
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room already exists' });
    }

    const room = new Room({
      roomNumber,
      floor,
      capacity,
      roomType,
      price
    });

    await room.save();
    res.status(201).json({ message: 'Room added successfully', room });
  } catch (error) {
    res.status(500).json({ message: 'Error adding room' });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    
    const room = await Room.findByIdAndUpdate(id, update, { new: true });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json({ message: 'Room updated successfully', room });
  } catch (error) {
    res.status(500).json({ message: 'Error updating room' });
  }
};

// Delete room
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    
    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room' });
  }
}; 