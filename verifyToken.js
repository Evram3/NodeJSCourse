const jwt = require('jsonwebtoken');
const appError = require('./appError');
const httpStatusText = require('./httpStatusText.js');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authoization'] || req.headers['authorization'];
    //  El header ele el key bt3ha asmoh 'Authoization' or 'authorization'
    if (!authHeader) {
        const error = appError.create("Token Required", 401, httpStatusText.ERROR);
        return next(error);
    };
    //  Lw ml2t4 "authHeader" mtkml4,34an dh m3nah enoh m4 authorized
    const token = authHeader.split(' ')[1];
    //  A2sm mn 3nd el space w adene el ba2e 3ala mara w7da
    console.log(token);
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV2YXNoZG9lczFAbWFpbC5jb20iLCJpZCI6IjY3MTE2NzE0YmY5MmUyMjIxYWM4NGE4NiIsImlhdCI6MTcyOTM1NjM5MCwiZXhwIjoxNzI5NDE2MzMwfQ.K_pnPmmYjXYUxIEJbY1lrQOylMzAMLHG7mlgNOcCNDE
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        //jwt.verify(Recived token from the header, JWT_SECRET_KEY, option);
        //  Verify that the Recived token from the header is correct and didn't expire
        console.log("Decoded Token:", decodedToken);//Decoded Token: {email: 'user111@mail.com', id: '6714dd64862c7c1feaaa9fd1', role: 'ADMIN', iat: 1729422864, exp: 1729482804}

        req.currentUser = decodedToken;
        //  3mlt option gded fel request, w dh hysa3dne b3d kda ageb el role zy fe file "allowed to"
        
        next();
        //  Fe 7alet en el "token" at3mloh decoding w m7sl4 mw4kla, kml w 5o4 3ala el b3doh
    } catch (err) {
        const error = appError.create('Ivalid token', 401, httpStatusText.ERROR);
        return next(error);
        //  Enama b2a lw la2et error, fa dh  m3nah enoh m3rf4 y3ml ll token decode, y3ne el token 8lt, fa mtkml4
    };
};

module.exports = verifyToken;