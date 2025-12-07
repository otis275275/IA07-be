import { Router } from "express";

const router = Router();

router.get('/', (req, res, next) => {
    res.json('Welcome to user registration form!');
});

export default router;