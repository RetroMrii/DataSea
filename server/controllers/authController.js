const jwt = require('jsonwebtoken');

const User = require('../models/User');
const AnalysisReport = require('../models/AnalysisReport');
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

const normalizeName = (value) => {
    return String(value || '').trim().toLowerCase();
};

const verifyUserConfirmation = async ({
    userId,
    submittedName,
    password,
}) => {
    if (!submittedName || !password) {
        return {
            success: false,
            status: 400,
            message: 'Account name and password are required.',
        };
    }

    const user = await User.findById(userId).select('+password');

    if (!user) {
        return {
            success: false,
            status: 404,
            message: 'User account not found.',
        };
    }

    if (normalizeName(submittedName) !== normalizeName(user.name)) {
        return {
            success: false,
            status: 400,
            message: 'The submitted account name does not match.',
        };
    }

    const passwordMatches = await user.matchPassword(password);

    if (!passwordMatches) {
        return {
            success: false,
            status: 401,
            message: 'The submitted password is incorrect.',
        };
    }

    return {
        success: true,
        user,
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

const deleteAccount = asyncHandler(async (req, res) => {
    const { name, password } = req.body;

    const verification = await verifyUserConfirmation({
        userId: req.user._id,
        submittedName: name,
        password,
    });

    if (!verification.success) {
        return res.status(verification.status).json({
            success: false,
            message: verification.message,
        });
    }

    const userId = verification.user._id;

    const reportDeletionResult = await AnalysisReport.deleteMany({
        owner: userId,
    });

    await User.deleteOne({
        _id: userId,
    });

    return res.status(200).json({
        success: true,
        message: 'Account and associated reports deleted successfully.',
        data: {
            deletedReports: reportDeletionResult.deletedCount || 0,
        },
    });
});

module.exports = {
    register,
    login,
    getMe,
    deleteAccount,
};