const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendOtp } = require("../utils/mailer");

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

router.post("/register", async (req, res, next) => {
  try {
    const { role, name, email, password, companyName } = req.body || {};
    if (!role || !name || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "Email already used" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      role: role === "recruiter" ? "recruiter" : "student",
      name,
      email: email.toLowerCase(),
      passwordHash,
      companyName: role === "recruiter" ? (companyName || "") : "",
    });

    const token = signToken(user);
    res.status(201).json({ token, user: safeUser(user) });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user);
    res.json({ token, user: safeUser(user) });
  } catch (e) {
    next(e);
  }
});

// Forgot password: request OTP
router.post("/forgot/request-otp", async (req, res, next) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpHash = await bcrypt.hash(otp, 10);
    const expMin = Number(process.env.OTP_EXP_MINUTES || 10);
    const expiresAt = new Date(Date.now() + expMin * 60 * 1000);

    user.resetOtpHash = otpHash;
    user.resetOtpExpiresAt = expiresAt;
    await user.save();

    await sendOtp(user.email, otp);
    res.json({ message: "OTP sent" });
  } catch (e) {
    next(e);
  }
});

// Forgot password: verify OTP + set new password
router.post("/forgot/reset", async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body || {};
    if (!email || !otp || !newPassword) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.resetOtpHash || !user.resetOtpExpiresAt) return res.status(400).json({ message: "Request OTP first" });
    if (user.resetOtpExpiresAt.getTime() < Date.now()) return res.status(400).json({ message: "OTP expired" });

    const ok = await bcrypt.compare(String(otp), user.resetOtpHash);
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetOtpHash = "";
    user.resetOtpExpiresAt = null;
    await user.save();

    res.json({ message: "Password updated. Please login." });
  } catch (e) {
    next(e);
  }
});

function safeUser(u) {
  return {
    id: u._id,
    role: u.role,
    name: u.name,
    email: u.email,
    bio: u.bio,
    skills: u.skills,
    resumeUrl: u.resumeUrl,
    companyName: u.companyName,
    companyLogoUrl: u.companyLogoUrl,
    companyBio: u.companyBio,
    companyPhotos: u.companyPhotos,
  };
}

module.exports = router;