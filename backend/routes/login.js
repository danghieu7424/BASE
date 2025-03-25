const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JsonHandler = require("../modules/NoSQL_mini/jsonHandler.js");

const jwtSecret =
    "Kq0m0RYJljjZgSVbZYwL1wnetdMPEOoRstBZFhBJfKdnfV6oZdHlUwVm8eC5w/ebrHn+9BDPeUgbMlLeU7LRHgY2RUowIwaDWrpNeKlH9RmW83bmxtn1eLhRg+BOZyy1HUIicbN6iK+drf27CuMHkI2EwtKfg+NDw/b1O/DPuJdJ3G/s3nfV/ModWjsAVp9XR5h+WkNl4amca/riE+I3Y4+YJAcSAtRP0aeiIdYvtMvVB2tTP94n0zuRE2n2kfBckyFDWmDfMDGaDRPYosassD7IdHbzo1j0k20VZP73xXgzVHcENrsj1QZ2JeHOBh+naFh7Gq6bPQHbaWdZOw3Utg==";

const usersDB = new JsonHandler("users");

/**
 * Đăng ký người dùng mới
 */
router.post("/api/auth/register", async (req, res) => {
    try {
        const { username, password, email, fullName, phone } = req.body;

        if (!username || !password || !email) {
            return res
                .status(400)
                .json({ message: "Vui lòng điền đầy đủ thông tin!" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email không hợp lệ!" });
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
        }

        const existingUser =
            usersDB.findData({ username })[0] || usersDB.findData({ email })[0];
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Username hoặc Email đã tồn tại!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = usersDB.addData({
            username,
            password: hashedPassword,
            email,
            fullName: fullName || "",
            phone: phone || "",
            role: "user",
            createdAt: new Date(),
        });

        res.status(201).json({
            message: "Đăng ký thành công!",
            user: { id: newUser.id, username, email },
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ!", error: error.message });
    }
});

/**
 * Đăng nhập
 */
router.post("/api/auth/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kiểm tra đầu vào
        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Vui lòng nhập username và password!" });
        }

        // Kiểm tra user trong DB
        const user = usersDB.findData({ username })[0];
        if (!user) {
            return res
                .status(401)
                .json({ message: "Sai username!" });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: "Sai mật khẩu!" });
        }

        const token = jwt.sign(
            { sub: user.username },
            jwtSecret,
            { expiresIn: "1d" }
        );

        res.json({
            token
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ!", error: error.message });
    }
});

/**
 *Kiểm tra người dùng
 */
router.post("/api/auth/verify", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, jwtSecret);

        const user = usersDB.findData({ username: decoded.sub })[0];

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        res.json({ user: { fullName: user.fullName, username: `@${user.username}` } });
    } catch (err) {
        console.error("Lỗi xác thực token:", err);
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
});



module.exports = router;