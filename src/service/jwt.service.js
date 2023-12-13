
const jwt = require('jsonwebtoken');
const { User } = require('../model/user.model');

/**
 * Creates a token for the given user.
 *
 * @param {User} user - The user object.
 * @return {string} The JWT token.
 */

const createToken = (user) => {

    let options = {
        email: user.email,
        role: user.role,
        language: user.language,
        lastActive: user.lastActive,
        isValidated: user.isValidated,
    }

    if (user.role == 'student') {
        options.grade = user.grade;
    }
    else if (user.role == 'tutor') {
        options.assignedGradesSubjects = Object.fromEntries(user.assignedGradesSubjects);
    }

    return jwt.sign(options, process.env.JWT_SECRET, {
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
        newuser.language = decoded.language;
        newuser.lastActive = decoded.lastActive;
        newuser.isValidated = decoded.isValidated;

        if (decoded.role == 'student') {
            newuser.grade = decoded.grade;
        }
        else if (decoded.role == 'tutor') {
            newuser.assignedGradesSubjects = new Map(Object.entries(decoded.assignedGradesSubjects));
        }

        return newuser;

    } catch (error) {
        throw new WrongCrendentialError('Invalid token');
    }
}


module.exports = {

    createToken,
    verifyToken
}