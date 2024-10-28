const asyncWrapper = require('./asyncWrapper');
const User = require('./user.model');
const httpStatusText = require('./httpStatusText');
const appError = require('./appError');

const bcrypt = require('bcryptjs');
//  El package ele masol 3n encryption el password

const jwt = require('jsonwebtoken');

const generateJWT = require('./generate JWT.js');
//  Bdl ma aktb el code el tawl da kol 4wia fa 3mlto function


const getAllUsers = asyncWrapper(async (req, res) => {
    
    console.log(req.headers);
    //authorization: 'Baerer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV2YXNoZG9lczFAbWFpbC5jb20iLCJJpZCI6IjY3MTE2NzE0YmY5MmUyMjIxYWM4NGE4NiIsImlhdCI6MTcyOTE5Mzc0OCwiZXhwIjoxNzI5MTkzODA4fQ.PVK4LS4EI4TZ9FjAjerMLzuDBMWnFLrYDoZ24aDvxh0'
    //  Dh ele ana ktbtoh fel headers wana bb3t el request mn el postman
    //  [In Postman] d5lt 3ala el header 3 samet el key "Authorization" w ktbt el "token" fel value
    //  Ktbt 2bl el token "Baerer" m3naha 7amel w bttb3t m3 el token kda
    // 5ale balk lama ktbt el console fel a5r mgable4 7aga m3rf4 leh

    const query = req.query;
    let limit = query.limit || 10;
    let page = query.page || 1;
    const skip = (page - 1) * limit;
    const users = await User.find({}, { "__v": false, 'password': false })
        .limit(limit).skip(skip);
    res.json({ status: httpStatusText.SUCCESS, data: { users } });
});


const register = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password, role } = req.body;
    //  7atle firstName, lastName, email, password, role mn el requested body
    console.log(req.body);

    console.log('Reguest.file-->', req.file);
    //Reguest.file-- > { fieldname: 'avatar', originalname: 'Screenshot (27).png', encoding: '7bit', mimetype: 'image/png', destination: 'uploads', filename: 'user-1730110173082.png', path: 'uploads\\user-1730110173082.png', size: 86950}

    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
        const error = appError.create("Email already exsits", 400, httpStatusText.FAIL);
        return next(error);
    };
    //Wait until examining the dataBase for having the same email
    //If existed, return error

    const hashedPassword = await bcrypt.hash(password, 10);
    // bcrypt.hash(ele password ele 3aiz t3mloh encrypion, salt: a random string, it is auto atttached with the hash);
    //  5od el "password" a3mle 3aleh hash (encryption) w attached feha 10 random string characters
    //  Kol ma kbrt el salt, kol ma a5d w2t akbr 34an y generate el encryption

    let newUser = new User({
        firstName,
        lastName,
        email,
        // password
        //  Mynf34 a3ml save ll password kda 3ade, 34an mmkn ay 7d y4ofh lazm a3mloh "hashing"
        password: hashedPassword,
        role,
        avatar: req.file.filename
    });

    //Generate JWT:
    const token = await jwt.sign({ email: newUser.email, id: newUser._id, role:newUser.role }, process.env.JWT_SECRET_KEY, { expiresIn: "1m" });
    //jwt.sign(Data: The data of the token's user , The special encryption which will be added to the JWT, { expiresIn: "El w2t ele ana 3aiez el JWT y7sloh expire b3doh" });
    console.log(token);
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV2YXNoZG9lczFAbWFpbC5jb20iLCJpZCI6IjY3MTE2NTg5Y2M2ZTAzNjE5NjE1ZDNjMCIsImlhdCI6MTcyOTE5MzM1M30.TgkYKZWEJTvy-bOyxzL6vpylbQAvqoK2W-0jPS_Z8II
    newUser.token = token;

    await newUser.save();
    //  Wait for the newUser to be saved, then continue the code
    res.status(201).json({ status: httpStatusText.SUCCESS, data: { User: newUser } });
})


const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email && !password) {
        const error = appError.create("Email and password are required", 400, httpStatusText.FAIL);
        return next(error);
    };
    const user = await User.findOne({ email: email });
    if (!user) {
        const error = appError.create("user not found", 400, httpStatusText.FAIL);
        return next(error);
    };
    
    const matchPassword = await bcrypt.compare(password, user.password);
    //  bcrypt.compare(inserted password by user during logining in, Hashed password);
    //  Compare inserted password by user during logining in with the Hashed password

    if (user && matchPassword) {
        const token = await generateJWT({ email: user.email, id: user._id, role: user.role });
        return res.json({ status: httpStatusText.SUCCESS, data: {token} });
    } else {
        const error = appError.create("Something wrong occured", 500, httpStatusText.ERROR);
        return next(error);
    };
});


module.exports = {
    getAllUsers,
    register,
    login
};