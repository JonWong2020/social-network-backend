const router = require('express').Router();
const { User } = require('../../models');

// get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});

        return res.status(200).json(users);
    } catch (err) {
        console.log('Error', err);
        res.status(500).json(err);
    }
};

// get user by id w/
const getSingleUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
            .select('-__v')

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID '})
        }

        return res.status(200).json(user);
    } catch (err) {
        console.log('Error', err);
        res.status(500).json(err);
    }
};
// create new user
const createNewUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);

        return res.json(newUser);
    } catch (err) {
        console.log('Error', err);
        res.status(500).json(err);
    }
};

// update user
const updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
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

// delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.id });

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID '})
        }

        return res.status(200).json(user);
    } catch (err) {
        console.log('Error', err);
        res.status(500).json(err);
    }
};

// add a friend
const addFriend = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $addToSet: { friends: req.params.friendId }},
            { new: true }
        )

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID '})
        }

        return res.status(200).json(user);
    } catch (err) {
        console.log('Error', err);
        res.status(500).json(err);
    }
};

// delete a friend
const deleteFriend = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $pull: { friends: req.params.friendId }},
            { new: true }
        )

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID '})
        }

        return res.status(200).json(user);
    } catch (err) {
        console.log('Error', err);
        res.status(500).json(err);
    }
};

// /api/users
router
    .route('/')
    .get(getAllUsers)
    .post(createNewUser)

// /api/users/:id
router
    .route('/:id')
    .get(getSingleUser)
    .put(updateUser)
    .delete(deleteUser)

// /api/users/:id/friends/:friendId
router
    .route('/:id/friends/:friendId')
    .post(addFriend)
    .delete(deleteFriend)

module.exports = router;