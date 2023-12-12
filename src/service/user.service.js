const { ResourceExistsError } = require("../error/resource.exists.error");
const { User, UserSchema } = require("../model/user.model");
const bcrypt = require("bcrypt");

/**
 * Registers a new user.
 *
 * @param {User} user - The user object containing user information.
 * @return {Promise<User>} - This function does not return anything.
 */
const registerNewUser = async (user) => {

    // check if user already exists
    const existingUser = await UserSchema.findByPk(user.email);
    if (existingUser) {
        throw new ResourceExistsError(`User already exists with id : ${user.email}`);
    }

    // hash the password
    try {
        user.password = bcrypt.hashSync(user.password, 5);

        await UserSchema.create({
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            language: user.language,
            lastActive: Date.now()
        })

        return user;

    } catch (error) {
        throw new Error("Something went wrong");
    }
}


/**
 * 
 * @param {string} email 
 * @returns {Promise<User>}
 */

const getUser = async (email) => {

    const user = await UserSchema.findByPk(email);
    return user;
}


module.exports = { registerNewUser, getUser }