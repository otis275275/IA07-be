import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import routes from "./routes/index.js"; 
import cors from "cors";
import cookieParser from 'cookie-parser'

const app = express();

// 1. Cấu hình CORS (Phải đặt TRƯỚC khi định nghĩa routes)

const allowedOrigins = [
    'https://ia-07-fe.vercel.app'
];

const corsOptions = {
    origin: allowedOrigins, 
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