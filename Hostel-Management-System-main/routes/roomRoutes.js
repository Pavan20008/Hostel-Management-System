const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const auth = require('../middleware/auth');

// Get all rooms
router.get('/', auth, async (req, res) => {
    try {
        const rooms = await Room.find().populate('occupants', 'name rollNumber');
        res.json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Error fetching rooms' });
    }
});

// Get room by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate('occupants', 'name rollNumber');
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
    } catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({ message: 'Error fetching room' });
    }
});

// Create room
router.post('/', auth, async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.status(201).json(room);
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(400).json({ message: 'Error creating room' });
    }
});

// Update room
router.put('/:id', auth, async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('occupants', 'name rollNumber');
        
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(400).json({ message: 'Error updating room' });
    }
});

// Delete room
router.delete('/:id', auth, async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ message: 'Error deleting room' });
    }
});

module.exports = router; 