import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import routes from "./routes/index.js"; 
import cors from "cors";
import cookieParser from 'cookie-parser'

const app = express();

// 1. Cấu hình CORS (Phải đặt TRƯỚC khi định nghĩa routes)

const allowedOrigins = [
    'https://ia-07-fe.vercel.app',
    'http://localhost:5173'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Kiểm tra xem Origin có phải là một trong các Origin được phép,
        // HOẶC là request không có Origin (như Postman/cURL hoặc server-to-server request nội bộ).
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Nếu không được phép, trả về lỗi.
            callback(new Error('Not allowed by CORS'));
        }
    }, 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));

const PORT = process.env.PORT || 5000;

// 3. Kết nối DB
connectDB();

// 2. Middleware xử lý body (cũng nên đặt trước routes)
app.use(express.json());
app.use(cookieParser())
app.use(
    express.urlencoded({
        extended: true,
    })
);



// 4. Định nghĩa Routes (Phải đặt SAU CORS và express.json)
routes(app);


if (process.env.NODE_ENV !== 'production') {
    app.listen(process.env.PORT, () => {
        console.log(`App listening on port ${process.env.PORT }`);
    });
}

export default app;