const express = require('express');

const {
    register,
    login,
    getMe,
    deleteAccount,
} = require('../controllers/authController');

const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const {
    registerSchema,
    loginSchema,
} = require('../validation/authValidation');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post(
    '/register',
    authLimiter,
    validate(registerSchema),
    register
);

router.post(
    '/login',
    authLimiter,
    validate(loginSchema),
    login
);

router.get('/me', protect, getMe);

router.delete('/account', protect, deleteAccount);

module.exports = router;