const appError = require("./appError");

module.exports = (...roles) => {
    //  El sperate operator lama ast5dmha m3 el parameters ele fel function by7wl7ale l array
    //  34an kda hwa 7awle el (...roles) l [ 'ADMIN', 'MANAGER' ]
    console.log(roles); //[ 'ADMIN', 'MANAGER' ]
    return (req, res, next) => {
        if (!roles.includes(req.currentUser.role)) {
            //  Bma en ana 5alet el roles array fa a2dr ast5dm m3aha "includes"
            //  If the array "roles" doesn't include el req.currentUser.role which equals el decoded code fel verifyToken file
            return next(appError.create("This role is not authorized", 401));
            //  return error
        };
        next();
    }
}