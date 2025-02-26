const express = require("express");
const authController = require("../controllers/UserController");
const router = express.Router();

const {
    validateSignup,
    validateLogin,
    validateVerifyOTP,
    validateResetPassword,
    generateOTP,
} = require("../middleware/useValidations");


// User Signup
router.post("/signup", validateSignup, authController.signup);

// User Login
router.post("/login", validateLogin, authController.login);

router.post("/generate-otp", generateOTP, authController.generateOtp);

// Verify OTP
router.post("/verify-otp", validateVerifyOTP, authController.verifyOTP);

// Reset Password
router.post("/reset-password", validateResetPassword, authController.resetPassword);

// Google Login
router.post("/google-auth", authController.googleAuth);


module.exports = router;
