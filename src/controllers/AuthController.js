import bcrypt from "bcryptjs";
import User from "../modals/User.js";
import jwt from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "../token/createToken.js";
const SALT_ROUNDS = 10;
class AuthController {
    //[POST] /api/auth/register
    async registerUser(req, res, next) {
        try {
            const data = req.validated;
            const { email, password } = data;
            const findUser = await User.findOne({ email });
            if (findUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            const newUser = new User({ email, password: hashedPassword });
            await newUser.save();
            return res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
            next(error);
        }
    }

    //[POST] /api/auth/login
    async login(req, res, next) {
        try {
            const data = req.validated;
            const { email, password } = data;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác" });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác" });
            }

            //Tạo token
            const accessToken = createAccessToken({id: user._id})
            const refreshToken = createRefreshToken({id: user._id})


            //Gửi refresh token vào cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly:true,
                secure: true,
                sameSite: "none",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            //Gửi access token về cho client
            return res.status(200).json({ message: "Login successful", accessToken });
        } catch (error) {
            res.status(500).json({ error: error.message });
            next(error);
        }
    }

    // [POST] /api/auth/logout
    async logout(req, res, next) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/"
        });
        return res.json({ message: "Logged out" });
    }

    //[POST] /api/auth/refresh
    async refreshToken(req, res, next) {
        try {
            //Kiểm tra xem có refresh token không, nếu có thì mới tạo access token mới
            const token = req.cookies.refreshToken;
            if (!token) {
                console.log("No refresh token provided");
                return res.status(401).json({ message: "No refresh token provided" });
            }

            const decoded = await new Promise((resolve, reject) => {
                // jwt.verify chạy không đồng bộ (asynchronously)
                jwt.verify(token, process.env.REFRESH_TOKEN, (err, decoded) => {
                    if (err) {
                        console.log("Invalid refresh token:", err.message);
                        // Nếu xác minh thất bại, gửi lỗi ra ngoài khối await
                        return reject(new Error("Invalid refresh token")); 
                    }
                    // Nếu xác minh thành công, trả về decoded payload
                    resolve(decoded);
                });
            }); // Kết thúc Promise

            // Dòng code này chỉ chạy khi Promise đã được resolve thành công
            // Nếu refresh token hợp lệ thì tạo access token mới
            const accessToken = createAccessToken({ id: decoded.id });
            return res.status(200).json({ accessToken });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
            next(error);
        }
    }

}

export default new AuthController();