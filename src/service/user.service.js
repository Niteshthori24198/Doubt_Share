
const { ResourceExistsError } = require("../error/resource.exists.error");
const { User, UserSchema, UserSubjectGradeSchema, Student, Tutor } = require("../model/user.model");
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
    } catch (error) {
        throw new Error(error.message);
    }

    await UserSchema.create({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        language: user.language,
        lastActive: Date.now(),
        isValidated: false
    })

    if (user.constructor === Student) {
        await UserSubjectGradeSchema.create({
            email: user.email,
            grade: user.grade
        })
    } else if (user.constructor === Tutor) {
        let m = user.assignedGradesSubjects;
        let o = [];

        for (let e of m.entries()) {
            for (let sub of e[1]) {
                o.push({
                    email: user.email,
                    grade: e[0],
                    subject: sub
                })
            }
        }

        await UserSubjectGradeSchema.bulkCreate(o);
    }

    return user;
}


/**
 * 
 * @param {string} email 
 * @returns {Promise<User>}
 */

const getUser = async (email) => {

    const user = await UserSchema.findByPk(email);

    if (user) {
        let userobj = user.role == 'tutor' ? new Tutor() : new Student();
        userobj.name = user.name;
        userobj.email = user.email;
        userobj.password = user.password;
        userobj.role = user.role;
        userobj.language = user.language;
        userobj.lastActive = user.lastActive;
        userobj.isValidated = user.isValidated;

        if (user.role == 'student') {
            const { grade } = await UserSubjectGradeSchema.findOne({ where: { email: user.email } });
            userobj.grade = grade;
        }
        else if (user.role == 'tutor') {
            const arr = await UserSubjectGradeSchema.findAll({ where: { email: user.email } });

            let m = new Map();
            for (let ele of arr) {
                const { grade, subject } = ele;
                if (!m.has(grade)) {
                    m.set(grade, [subject]);
                } else {
                    m.get(grade).push(subject);
                }
            }

            userobj.assignedGradesSubjects = m;
        }

        return userobj;
    }

    return null;
}



module.exports = { registerNewUser, getUser }