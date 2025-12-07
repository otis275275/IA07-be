import jwt from "jsonwebtoken";

//middleware xác thực xem có access token hợp lệ hay không
export default function authorize(req, res, next) {
    const authHeader = req.headers.authorization.split(' ')[1];
    if (!authHeader) {
        return res.status(401).json({ message: "Người dùng chưa được xác nhập, thiếu access token" });
    }

    //Decode ở đây là payload lúc sign token
    jwt.verify(authHeader, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // Lỗi 401: Token hết hạn, cần làm mới (refresh)
                return res.status(401).json({ 
                    message: "Access token đã hết hạn", 
                    errorType: "TokenExpired" 
                });
            } else {
                // Lỗi 403: Các lỗi không hợp lệ khác (ví dụ: chữ ký sai)
                return res.status(403).json({ 
                    message: "Access token không hợp lệ hoặc bị giả mạo",
                    errorType: "InvalidToken"
                });
            }
        }
        req.userId = decoded.id;
        next();
    })

}