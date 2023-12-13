
const { ResourceAbsentError } = require("../error/resource.absent.error");
const { UserValidationError } = require("../error/user.validation.error");
const { Doubt, DoubtSchema } = require("../model/doubt.model");
const { UserSchema, User, UserSubjectGradeSchema } = require("../model/user.model");
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
 */

const assignedDoubt = async (doubtId, tutorEmail, checkValidity = true) => {

    if (checkValidity) {

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
    }

    await DoubtSchema.update({
        tutorEmail: tutorEmail
    }, {
        where: {
            id: doubtId
        }
    })
}

/**
 * @param {number} doubtId
 * @param {string} solution
 * @return {Promise<Doubt>}
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

/**
 * @param {Map<string,object>} pingedUsers
 */

const doubtAssignmentScheduler = async (pingedUsers) => {

    let ds = await DoubtSchema.findAll({
        where: {
            tutorEmail: null,
            doubtSolution: null
        }
    })

    let activeTutors = [];
    for (let e of pingedUsers.entries()) {
        if (e[1].role == 'student' || !e[1].isValidated) continue;
        activeTutors.push(e[1]);
    }

    let m = new Map();
    let ats, s, usg;

    for (let d of ds) {

        if (!m.has(d.studentEmail)) {

            s = await UserSchema.findByPk(d.studentEmail);
            usg = await UserSubjectGradeSchema.findOne({
                where: {
                    email: d.studentEmail
                }
            });
            ats = activeTutors.filter((t) => {
                return t.language == s.language && t.assignedGradesSubjects.has(usg.grade);
            })

            m.set(d.studentEmail, ats);
        } else {
            ats = m.get(d.studentEmail);
        }

        ats = ats.filter((t) => {
            return t.assignedGradesSubjects.get(usg.grade).includes(d.doubtSubject);
        })

        if (ats.length) {
            await assignedDoubt(d.id, ats[0].email, false);
        }
    }
}



module.exports = {
    createDoubt,
    assignedDoubt,
    handleDoubt,
    getAllDoubts,
    doubtAssignmentScheduler
}