import User from "../modals/User.js";
export const validationRulesLogin = {
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