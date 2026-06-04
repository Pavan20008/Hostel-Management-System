const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const auth = require('../middleware/auth');

// Get all fees
router.get('/', auth, async (req, res) => {
    try {
        const fees = await Fee.find()
            .populate('student', 'name rollNumber')
            .sort({ dueDate: 1 });
        res.json(fees);
    } catch (error) {
        console.error('Error fetching fees:', error);
        res.status(500).json({ message: 'Error fetching fees' });
    }
});

// Get fees for a specific student
router.get('/student/:studentId', auth, async (req, res) => {
    try {
        const fees = await Fee.find({ student: req.params.studentId })
            .populate('student', 'name rollNumber')
            .sort({ dueDate: 1 });
        res.json(fees);
    } catch (error) {
        console.error('Error fetching student fees:', error);
        res.status(500).json({ message: 'Error fetching student fees' });
    }
});

// Create fee
router.post('/', auth, async (req, res) => {
    try {
        const fee = new Fee(req.body);
        await fee.save();
        await fee.populate('student', 'name rollNumber');
        res.status(201).json(fee);
    } catch (error) {
        console.error('Error creating fee:', error);
        res.status(400).json({ message: 'Error creating fee' });
    }
});

// Update fee
router.put('/:id', auth, async (req, res) => {
    try {
        const fee = await Fee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('student', 'name rollNumber');
        
        if (!fee) {
            return res.status(404).json({ message: 'Fee not found' });
        }
        res.json(fee);
    } catch (error) {
        console.error('Error updating fee:', error);
        res.status(400).json({ message: 'Error updating fee' });
    }
});

// Delete fee
router.delete('/:id', auth, async (req, res) => {
    try {
        const fee = await Fee.findByIdAndDelete(req.params.id);
        if (!fee) {
            return res.status(404).json({ message: 'Fee not found' });
        }
        res.json({ message: 'Fee deleted successfully' });
    } catch (error) {
        console.error('Error deleting fee:', error);
        res.status(500).json({ message: 'Error deleting fee' });
    }
});

module.exports = router; 