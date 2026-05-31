const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long'],
            maxlength: [60, 'Name cannot exceed 60 characters'],
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [7, 'Password must be at least 7 characters long'],
            select: false,
        },

        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },

        avatar: {
            type: String,
            default: '',
        },

        settings: {
            theme: {
                type: String,
                enum: ['dark', 'light'],
                default: 'dark',
            },
            confirmReportNameBeforeSave: {
                type: Boolean,
                default: true,
            },
            language: {
                type: String,
                enum: ['en', 'he'],
                default: 'en',
            },
        },
    },
    {
        timestamps: true,
    }
);

userSchema.virtual('reports', {
    ref: 'AnalysisReport',
    localField: '_id',
    foreignField: 'owner',
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);