import jwt from "jsonwebtoken";

// middleware xác thực xem có access token hợp lệ hay không
export default function authorize(req, res, next) {
    // SỬA LỖI: Kiểm tra sự tồn tại của header trước khi gọi split
    const authorization = req.headers.authorization; 
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Người dùng chưa được xác thực, thiếu access token hoặc định dạng sai" });
    }

    // Tách token
    const authHeader = authorization.split(' ')[1]; 

    // Decode ở đây là payload lúc sign token
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
    }); // Lỗi của jwt.verify được xử lý trong callback, không cần try/catch bên ngoài.
    
}