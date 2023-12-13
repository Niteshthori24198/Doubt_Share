
const { ResourceAbsentError } = require("../error/resource.absent.error");
const { UserValidationError } = require("../error/user.validation.error");
const { Doubt, DoubtSchema } = require("../model/doubt.model");
const { UserSchema } = require("../model/user.model");
const { IllegalRequestError } = require("../error/illegal.request.error");


const doubtSchemaToDoubt = (newdoubt) => {

    let doubt = new Doubt();
    doubt.id = newdoubt.id;
    doubt.studentEmail = newdoubt.studentEmail;
    doubt.doubtSubject = newdoubt.doubtSubject;
    doubt.doubtDescription = newdoubt.doubtDescription;
    doubt.doubtCreationTime = newdoubt.doubtCreationTime;
    doubt.tutorEmail = newdoubt.tutorEmail;
    doubt.doubtSolution = newdoubt.doubtSolution;

    return doubt;
}


/**
 * @param {Doubt} doubt
 * @param {string} studentEmail
 * @return {Promise<Doubt>}
 */

const createDoubt = async (doubt, studentEmail) => {

    let user = await UserSchema.findByPk(studentEmail);

    if (!user || user.role != 'student') {
        throw new ResourceAbsentError("Student not found");
    }

    // if(!user.isValidated) {
    //     throw new UserValidationError("Student not validated");
    // }

    let newdoubt = await DoubtSchema.create({
        studentEmail: studentEmail,
        doubtSubject: doubt.doubtSubject,
        doubtDescription: doubt.doubtDescription,
        doubtCreationTime: Date.now()
    });

    doubt = doubtSchemaToDoubt(newdoubt);

    return doubt;
}


/**
 * @param {number} doubtId
 * @param {string} tutorEmail
 * @return {Promise<Doubt>}
 */

const assignedDoubt = async (doubtId, tutorEmail) => {

    let d = await DoubtSchema.findByPk(doubtId);

    if (!d) {
        throw new ResourceAbsentError('Invalid Doubt id detected')
    }

    let t = await UserSchema.findByPk(tutorEmail);

    if (!t || t.role != 'tutor') {
        throw new ResourceAbsentError('Invalid Tutor email')
    }

    // if(!t.isValidated) {
    //     throw new UserValidationError("Tutor not validated");
    // }

    await DoubtSchema.update({
        tutorEmail: tutorEmail
    }, {
        where: {
            id: doubtId
        }
    })

    d.tutorEmail = tutorEmail;
    d = doubtSchemaToDoubt(d);
    return d;

}

/**
 * @param {number} doubtId
 * @param {string} solution
 */

const handleDoubt = async (doubtId, solution, tutorEmail) => {

    let d = await DoubtSchema.findByPk(doubtId);

    if (!d) {
        throw new ResourceAbsentError('Invalid Doubt id detected')
    }

    let t = await UserSchema.findByPk(tutorEmail);

    if (!t || t.role != 'tutor') {
        throw new ResourceAbsentError('Invalid Tutor email')
    }

    // if(!t.isValidated) {
    //     throw new UserValidationError("Tutor not validated");
    // }

    if (d.tutorEmail != tutorEmail) {
        throw new IllegalRequestError('Doubt not assigned to you')
    }

    d = await DoubtSchema.update({
        doubtSolution: solution
    }, {
        where: {
            id: doubtId
        }
    })

    d = doubtSchemaToDoubt(d);
    return d;
}


/**
 * @param {string} email
 * @return {Promise<Doubt[]>}
 */

const getAllDoubts = async (email) => {

    let user = await UserSchema.findByPk(email);

    if (!user) {
        throw new ResourceAbsentError("User not found");
    }

    // if(!user.isValidated) {
    //     throw new UserValidationError("Student not validated");
    // }

    let doubts = [];

    if (user.role == 'student') {
        doubts = await DoubtSchema.findAll({
            where: {
                studentEmail: email
            },
            order: [['doubtCreationTime', 'DESC']]
        })
    }
    else if (user.role == 'tutor') {
        doubts = await DoubtSchema.findAll({
            where: {
                tutorEmail: email
            },
            order: [['doubtCreationTime', 'DESC']]
        })
    }

    doubts = doubts.map(d => doubtSchemaToDoubt(d));

    return doubts;
}


module.exports = {
    createDoubt,
    assignedDoubt,
    handleDoubt,
    getAllDoubts
}