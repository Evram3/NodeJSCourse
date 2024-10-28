const mongoose = require('mongoose');
const validator = require('validator');
//  To make sure that the inserted email is a corect email address

const userRoles = require("./user-roles");
// const userRoles = {
//     ADMIN: "ADMIN",
//     USER: "USER",
//     MANAGER: "MANAGER"
// };

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        //  Myb2a4 mkrr
        validate: [validator.isEmail, "Field must be a vaild email address"]
        //  Validate that the inserted is a valid email address
    },
    password: {
        type: String
    },
    token: {
        type: String
    },
    role: {
        type: String,
        enum: [userRoles.USER, userRoles.ADMIN, userRoles.MANAGER],
        //  El type bta3 "role" String bs lazm yb2a 7aga mn el dwl [userRoles.USER, userRoles.ADMIN, userRoles.MANAGER]
        default: userRoles.USER,
        //  El default value hya user
    },
    avatar: {
        //  El image bta3t el user
        type: String,
        default:'/uploads/Screenshot (4).png'
    }
});
console.log(userRoles.USER)
module.exports = mongoose.model("User", userSchema);