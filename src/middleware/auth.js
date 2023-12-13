const { verifyToken } = require('../service/jwt.service');

const auth = async (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(403).send({
            success: false,
            message: "No token provided"
        })
    }

    let user;

    try {
        user = verifyToken(token);
    } catch (error) {
        return res.status(403).send({
            success: false,
            message: "Invalid token"
        })
    }

    req.body._user = user;

    next();

}



module.exports = { auth }