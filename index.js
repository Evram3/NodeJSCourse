/*
    JWT:
        JSON Web Token
        Ex: A server could generate a token that has the claim "logged in as administrator" and provide that to a client. the client could the  use that token to prove that it is logged in as admin
        Zy access card el user bya5odha lama y5ml login successfully, y2dr b2a bl access card de yaccess ay link m7tag t login, w tb3n mn 8eroh my2dr4 yaccess el links de

        Consists of 3 layers:
            1) Algorithm and token type
            2) Data. As: byanat el user
            3)Verify signature. verifying that this a stander JWT

        jsonwebtoken:
            Package bts3adne at3aml m3 el JWT

    Headers:
        7tla2eha fel postman
        De 7aga t2dr tb3tha m3 el link ele anta btb3toh
        B2olh lw el header ele galk dh zy ele ana 3izoh, a3ml kza

    multer:
        NodeJS middleware (package) for handling multipart/form-data, which is primarily used for uploading files

    Render.com
        El site el ana hrf3 3aleha el project
*/

const express = require('express');
const app = express();
app.listen(process.env.PORT || 500, () => {
    console.log(`app is listening on port ${process.env.PORT}`);
});
const courseRouter = require('./router');
app.use('/api/courses', courseRouter);
require('dotenv').config();
const url = process.env.MONGO_URL;
console.log(url);
const mongoose = require('mongoose');
mongoose.connect(url).then(() => {
    console.log('mongoose conected successfully');
});
const httpStatusText = require('./httpStatusText');
// app.all("*", (req, res, next) => {
//     return res.status(404).json({ status: httpStatusText.ERROR, message: "Can not reach" });
// });
const cors = require('cors');
app.use(cors());
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).
        json({
            status: error.statusText || httpStatusText.ERROR,
            message: error.message,
            code: error.statusCode || 500,
            data: null
        });
});


//[In terminal] npm i validator
//  To be used in user model to validate the input as a correct email address

//[In terminal] npm i bcryptjs
//  El paackage ele bt3mle hashing ll password b7aes m7d4 y3rf y2rah lw d5l 3ala el dataBase

//[In terminal] npm i jsonwebtoken
//  Package bts3adne at3aml m3 el JWT

const userRouter = require('./user.routes');
app.use('/api/users', userRouter);


const path = require('path');
//  Built in function gwa el node
//  a2dr beha a3ml handling aw calling l path el files btare2a mo7trama tm4e m3 kol el operating systems

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
//  B2olh 5ale file "uploads" static, 34an a2dr ast5dm ele feh
//  __dirname: el current director ele ana wa2f feh
//  join: admghomle m3 b3d
//  El 5olasa zy kane 2oltloh "./uploads" bs 34an mmkn el "/" t5tlf mn operating system ll tane


//[In Terminal] npm i multer