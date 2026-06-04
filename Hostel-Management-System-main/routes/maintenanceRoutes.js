const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const auth = require('../middleware/auth');

// Get all maintenance requests
router.get('/', auth, async (req, res) => {
    try {
        const requests = await Maintenance.find()
            .populate('student', 'name rollNumber')
            .populate('room', 'roomNumber')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        res.status(500).json({ message: 'Error fetching maintenance requests' });
    }
});

// Get maintenance requests for a specific student
router.get('/student/:studentId', auth, async (req, res) => {
    try {
        const requests = await Maintenance.find({ student: req.params.studentId })
            .populate('student', 'name rollNumber')
            .populate('room', 'roomNumber')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching student maintenance requests:', error);
        res.status(500).json({ message: 'Error fetching maintenance requests' });
    }
});

// Create maintenance request
router.post('/', auth, async (req, res) => {
    try {
        const request = new Maintenance({
            ...req.body,
            student: req.user.id
        });
        await request.save();
        await request.populate('student', 'name rollNumber');
        await request.populate('room', 'roomNumber');
        res.status(201).json(request);
    } catch (error) {
        console.error('Error creating maintenance request:', error);
        res.status(400).json({ message: 'Error creating maintenance request' });
    }
});

// Update maintenance request
router.put('/:id', auth, async (req, res) => {
    try {
        const request = await Maintenance.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('student', 'name rollNumber')
        .populate('room', 'roomNumber');
        
        if (!request) {
            return res.status(404).json({ message: 'Maintenance request not found' });
        }
        res.json(request);
    } catch (error) {
        console.error('Error updating maintenance request:', error);
        res.status(400).json({ message: 'Error updating maintenance request' });
    }
});

// Delete maintenance request
router.delete('/:id', auth, async (req, res) => {
    try {
        const request = await Maintenance.findByIdAndDelete(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Maintenance request not found' });
        }
        res.json({ message: 'Maintenance request deleted successfully' });
    } catch (error) {
        console.error('Error deleting maintenance request:', error);
        res.status(500).json({ message: 'Error deleting maintenance request' });
    }
});

module.exports = router; 