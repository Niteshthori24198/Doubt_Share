
const jwt = require('jsonwebtoken');
const { User } = require('../model/user.model');

/**
 * Creates a token for the given user.
 *
 * @param {User} user - The user object.
 * @return {string} The JWT token.
 */

const createToken = (user) => {

    return jwt.sign({
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
}

/**
 * 
 * @param {string} token 
 * @returns {User} 
 */

const verifyToken = (token) => {

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const newuser = new User();

        newuser.email = decoded.email;
        newuser.role = decoded.role;
        return newuser;

    } catch (error) {
        throw new WrongCrendentialError('Invalid token');
    }
}


module.exports = {

    createToken,
    verifyToken
}