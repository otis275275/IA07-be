import { matchedData, validationResult } from "express-validator";

export default function validator(req, res, next) {
    const errors = validationResult(req);

    //Stop if there are validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    // matchedData: chỉ lấy dữ liệu hợp lệ
    req.validated = matchedData(req);

    next();
}