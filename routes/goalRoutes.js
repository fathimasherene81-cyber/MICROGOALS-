const express = require('express');
const router = express.Router();
const Goal = require('../models/goalModel'); // This must match your filename in /models
const { protect } = require('../middleware/authMiddleware');

// 1. GET ALL GOALS
router.get('/', protect, async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. GET SINGLE GOAL
router.get('/:id', protect, async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (goal && goal.user.toString() === req.user.id) {
            res.status(200).json(goal);
        } else {
            res.status(404).json({ message: 'Goal not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. CREATE A GOAL
router.post('/', protect, async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).json({ message: 'Please add a title' });
        }
        const goal = await Goal.create({
            title: req.body.title,
            user: req.user.id,
        });
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. UPDATE A GOAL
router.put('/:id', protect, async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedGoal = await Goal.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );

        res.status(200).json(updatedGoal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 5. DELETE A GOAL
router.delete('/:id', protect, async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await goal.deleteOne();
        res.status(200).json({ id: req.params.id, message: "Goal removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;