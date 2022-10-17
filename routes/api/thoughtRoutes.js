const router = require('express').Router();
const { User, Thought } = require('../../models');

// GET all thoughts
const getAllThoughts = async (req, res) => {
    try {
        const thoughts = await Thought.find({})
            .select('-__v')
            .sort('-createdAt');
        
        res.status(200).json(thoughts);
    } catch (err) {
        console.log('Error', err);
        res.status(500).json(err);
    }
};

// GET thought by ID
const getSingleThought = async (req, res) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.id })
            .select('-__v')
        
        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID '})
        }

        return res.status(200).json(thought);
    } catch (err) {
        console.log('Error', err);
        res.status(500).json(err);
    }
};

// POST thought w/associated user array
const createThought = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { username: req.body.author },
            { $push: { thoughts: (await Thought.create(req.body))._id }},
            { runValidators: true, new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID '})
        }

        return res.status(200).json(user);
    } catch (err) {
        console.log('Error', err);
        res.status(500).json(err);
    }
};

// /api/thoughts
router
    .route('/')
    .get(getAllThoughts)
    .post(createThought);

// /api/thoughts/:id
router
    .route('/:id')
    .get(getSingleThought)

module.exports = router;