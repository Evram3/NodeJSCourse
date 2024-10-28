const express = require('express');
const router = express.Router();
router.use(express.json());
const userController = require("./user.controller");
const verifyToken = require('./verifyToken');
//  El function el mas2ola 3n exetraction el token mn el sent header

router.route('/')
    .get(verifyToken, userController.getAllUsers);
//  B2olh y3ade 3ala el verifyToken el awl, lw tmam, kml


// const multer = require('multer');
const appError = require('./appError');

// const diskStorage = multer.diskStorage({
//     destenation(req, file, callBack) {
//         console.log("FILE:", file);
//         callBack(null/*error*/, "uploads");
//     },
//     fileName: function (req, file, calBack) {
//         const extension = file.minetype.split('/')[1];
//         const fileName = `user-${Date.now()}.${extension}`;
//         calBack(null, fileName);
//     }
// });

// const fileFilter = (req, file, callBack) => {
//     const imageType = file.minetype.split('/')[0];
//     if (imageType == 'image') {
//         return callBack(null, true);
//     } else {
//         return callBack(appError.create("File must be image", 400), false);
//     }
// }

const multer = require('multer');

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) { //cb:call back
        console.log('FILE', file); //firstName: 'user@', lastName: 'aboh', email: 'user13@gmail.com', password: 'abc', role: 'MANAGER'}
        cb(null, 'uploads');
        //cb(error, el 7aga ele 3aiz arg3ha );
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        //  El file.mimetype de ele byb2a mktob feha el file extension
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
    //  el filename de bttdek el amkanya enk tt7kb fel tsmya bta3t el sile bta3k
})
//  DiskStorage gives you full control on storing files to disk

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    if (imageType == 'image') {
        return cb(null, true);
        //Error: null, true: tmam kml zy manta
    } else {
        return cb(appError.create('File must be an image', 400), false);
    }
};
//  Check if the uploaded file is image or not
//  If image continue
//  If else return error

const upload = multer({
    storage: diskStorage,
    fileFilter: fileFilter
    //  De function to constrol which uploaded files are accepted 
});
//  3mlt variable asmoh upload ktbt feha el data bta3t el file ele h3ml fe save ll uploaded file w properties el uploaded file dh 34an a2dr ast5dmoh del router

router.route('/register')
    .post(upload.single('avatar'), userController.register);
//  upload.single('field name')
//      kda ana zwt option el uploading fel registeration, 34an el user lama yege y3ml upload ll image bt3toh
//      [In Postman] http://localhost:500/api/uploads/user-1730107837862.png
//          Hydek el swra

router.route('/login')
    .post(userController.login);

module.exports = router;