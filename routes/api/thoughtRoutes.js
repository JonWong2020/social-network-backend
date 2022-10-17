const router = require('express').Router();
const { User, Thought } = require('../../models');

// GET all thoughts

const getAll = async (req, res) => {
    try {
        const thoughts = await Thought.find({})
            .select('-__v')
            .sort('-createdAt');
        
        res.status(200).json(thoughts);
    } catch (err) {
        res.status(500).json(err);
    }
};

// GET by ID

// POST thought w/associated user array