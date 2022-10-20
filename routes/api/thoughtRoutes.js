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
            { username: req.body.username },
            { $push: { thoughts: (await Thought.create(req.body))._id }},
            { runValidators: true, new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No thought with that ID '})
        }

        return res.status(200).json(user);
    } catch (err) {
        console.log('Error', err);
        res.status(500).json(err);
    }
};

// PUT/update thought
const updateThought = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID '})
        }

        return res.status(200).json(thought);
    } catch (err) {
        console.log('Error', err);
        res.status(500).json(err);
    }
};

// delete thought
const deleteThought = async (req, res) => {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.id });

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID '})
        }

        await User.findOneAndUpdate(
            { username: thought.username },
            { $pull: { thoughts: thought._id }},
            { runValidators: true, new: true }
        );

        return res.status(200).json({ message: 'Thought Deleted', thoughtDeleted: thought });
    } catch (err) {
        console.log('Error', err);
        res.status(500).json(err);
    }
};

// POST reaction
const createReaction = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: {
                reactionText: req.body.reactionText,
                username: req.body.username
            }}},
            { new: true }
        );

        return res.status(200).json(thought);
    } catch (err) {
        console.log('Error', err);
        res.status(500).json(err);
    }
};

// delete reaction
const deleteReaction = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { _id: req.params.reactionId }}},
            { runValidators: true, new: true }
        )
        .select('-__v');

        if (!thought) {
            return res.status(404).json({ message: 'No thought found '})
        }

        return res.status(200).json(thought);
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
    .put(updateThought)
    .delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
router
    .route('/:thoughtId/reactions')
    .post(createReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction);
    
module.exports = router;