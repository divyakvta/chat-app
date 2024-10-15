const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const GUEST_CREDENTIALS = {
    email: "guest@example.com",
    password: "guest123",
  };
  

const register = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(500);
        throw new Error("Failed to create the user");
    }
});

const authUser = asyncHandler(async (req,res) => {
    const { email, password} = req.body;

    if (email === GUEST_CREDENTIALS.email && password === GUEST_CREDENTIALS.password) {
        return res.json({
            _id: "guest_user",
            name: "Guest User",
            email: GUEST_CREDENTIALS.email,
            pic: "",
            token: generateToken("guest_user"),
        });
    }

    const user = await User.findOne({ email });

    if(user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    }else {
        res.status(400);
        throw new Error("Invalid email or password")
    }
});

const getAllUsers = asyncHandler(async (req, res) => {

    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

   
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

   
    res.status(200).json(users);
});


module.exports = { register, authUser, getAllUsers };
