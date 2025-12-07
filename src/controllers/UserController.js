import User from "../modals/User.js"


class UserController {
    //[GET] api/user
    async getUser(req, res, next) {
        const id = req.userId;
        try {
            const user = await User.findById(id)
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
            next(error);
        }
    }
}

export default new UserController()