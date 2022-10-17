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

// delete user