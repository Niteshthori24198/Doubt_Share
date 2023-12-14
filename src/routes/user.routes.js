const express = require('express');
const bcrypt = require('bcrypt');
const { isNameValid, isEmailValid, isPasswordValid, isLanguageValid, isGradeValid, isAssignedGradesSubjectsValid } = require('../service/validation.service');
const { User, Student, Tutor } = require('../model/user.model');
const { registerNewUser, getUser } = require('../service/user.service');
const { ResourceExistsError } = require('../error/resource.exists.error');
const { createToken } = require('../service/jwt.service');
const userRouter = express.Router();
const { auth } = require('../middleware/auth');
const { pingedUsers } = require('../singleton/singleton');

const createUser = async (req, res, role) => {

    const { name, email, password, language, grade, assigned } = req.body;

    if (role == 'student' && (Array.isArray(grade) || !isGradeValid(grade))) {
        return res.status(400).send({
            success: false,
            message: 'Student must provide only one grade'
        })
    }

    if (role == 'tutor' && (!assigned || !isAssignedGradesSubjectsValid(assigned))) {
        return res.status(400).send({
            success: false,
            message: 'Tutor must provide both assigned grades and subjects'
        })
    }

    if (!isNameValid(name) || !isEmailValid(email) || !isPasswordValid(password) || !isLanguageValid(language)) {

        return res.status(400).send({
            success: false,
            message: 'Kindly enter valid details : name, email, password, language'
        });
    }


    // create user object for storing in db

    let newuser = role == 'student' ? new Student() : new Tutor();
    newuser.email = email;
    newuser.name = name;
    newuser.password = password;
    newuser.language = language;
    newuser.role = role;

    if (role == 'student') {
        newuser.grade = grade;
    }
    else if (role == 'tutor') {

        let m = new Map();

        for (let grade in assigned) {
            m.set(grade, assigned[grade]);
        }
        newuser.assignedGradesSubjects = m;
    }

    try {
        newuser = await registerNewUser(newuser);
    } catch (error) {

        let statuscode = 500;

        if (error.constructor == ResourceExistsError) {
            statuscode = 409;
        }

        return res.status(statuscode).send({
            success: false,
            message: error.message
        })
    }

    return res.status(200).send({
        success: true,
        user: {
            name: newuser.name,
            email: newuser.email,
            language: newuser.language,
            lastActive: newuser.lastActive
        }
    })

}


userRouter.post('/student/signup', (req, res) => {
    createUser(req, res, 'student')
});

userRouter.post('/tutor/signup', (req, res) => {
    createUser(req, res, 'tutor')
});

userRouter.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (!isEmailValid(email) || !isPasswordValid(password)) {
        return res.status(400).send({
            success: false,
            message: 'Kindly enter valid details : email, password'
        });
    }

    const user = await getUser(email);

    if (!user || !user.isValidated) {
        return res.status(404).send({
            success: false,
            message: 'User not found or User not validated'
        });
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).send({
            success: false,
            message: 'Incorrect password'
        });
    }

    return res.status(200).send({
        success: true,
        token: createToken(user),
        role:user.role
    })

})


userRouter.post("/logout", auth, async (req, res) => {

    const user = req.body._user;
    
    pingedUsers.delete(user.email);

    return res.status(200).send({
        success: true
    })
})


userRouter.get("/active", auth, async (req, res) => {

    const user = req.body._user;
    user._lastpingedtime = Date.now();

    pingedUsers.set(user.email, user);

    return res.status(200).send({
        success: true
    })
})

module.exports = userRouter;