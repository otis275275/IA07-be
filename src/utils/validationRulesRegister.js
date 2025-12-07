import User from "../modals/User.js";
export const validationRulesRegister = {
    email : {
        isString : {
            errorMessage : "Query must be a string"
        },
        notEmpty: {
            errorMessage : "Query must not be empty"
        }, 
        isEmail: {
            errorMessage : "Invalid email format"
        },
        custom: {
            options: async (value) => {
                const user = await User.findOne({ email: value });
                if (user) throw new Error("Email đã tồn tại"); // check unique
            }
        }
    },
    password : {
        isLength: {
            options: {
                min: 5,
                max: 10,
            },
            errorMessage : 
                "Username must between 5-10 characters",
        },
        notEmpty: {
            errorMessage : "Password must not be empty"
        }
    }
}