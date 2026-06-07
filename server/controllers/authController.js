const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        }
    );
};

const buildUserResponse = (user) => {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        settings: user.settings,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: 'Email is already registered',
        });
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    const token = generateToken(user);

    return res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
            user: buildUserResponse(user),
            token,
        },
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
    }

    const token = generateToken(user);

    return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            user: buildUserResponse(user),
            token,
        },
    });
});

const getMe = asyncHandler(async (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Current user retrieved',
        data: {
            user: buildUserResponse(req.user),
        },
    });
});

module.exports = {
    register,
    login,
    getMe,
};