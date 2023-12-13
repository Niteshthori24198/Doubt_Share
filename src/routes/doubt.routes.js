
const express = require('express');
const doubtRouter = express.Router();
const { createDoubt, handleDoubt, getAllDoubts } = require('../service/doubt.service');
const { auth } = require('../middleware/auth');
const { ResourceAbsentError } = require('../error/resource.absent.error');
const { UserValidationError } = require('../error/user.validation.error');
const { IllegalRequestError } = require('../error/illegal.request.error');
const { isSubjectValid } = require('../service/validation.service');
const { Doubt } = require('../model/doubt.model');


const doubtToObj = (d) => {

    return {
        id: d.id,
        doubtSubject: d.doubtSubject,
        doubtDescription: d.doubtDescription,
        tutorEmail: d.tutorEmail,
        studentEmail: d.studentEmail,
        doubtCreationTime: d.doubtCreationTime,
        doubtSolution: d.doubtSolution,
    }
}


doubtRouter.post("/create", auth, async (req, res) => {

    const { doubtSubject, doubtDescription } = req.body;
    const { email, role } = req.body._user;

    if (!isSubjectValid(doubtSubject) || (doubtDescription && typeof doubtDescription != 'string')) {
        return res.status(400).send({
            success: false,
            message: 'Kindly enter valid details : doubtSubject, doubtDescription'
        })
    }

    let d = new Doubt();
    d.doubtSubject = doubtSubject;
    d.doubtDescription = doubtDescription;

    try {

        d = await createDoubt(d, email);
    } catch (error) {

        let code = 500;
        if (error.constructor === ResourceAbsentError) {
            code = 404;
        }
        else if (error.constructor === UserValidationError) {
            code = 400;
        }
        return res.status(code).send({
            success: false,
            message: error.message
        })
    }

    return res.status(200).send({
        success: true,
        doubt: doubtToObj(d)
    })
});


doubtRouter.post("/handle/:doubtId", auth, async (req, res) => {

    const { email, role } = req.body._user;
    const { doubtId } = req.params;
    const { solution } = req.body;

    if (typeof solution !== 'string') {
        return res.status(400).send({
            success: false,
            message: 'Kindly enter valid details : solution (string)'
        })
    }

    let d;
    try {
        d = await handleDoubt(doubtId, solution, email);
    } catch (error) {
        let code = 500;
        if (error.constructor === ResourceAbsentError) {
            code = 404;
        }
        else if (error.constructor === UserValidationError || error.constructor === IllegalRequestError) {
            code = 400;
        }
        return res.status(code).send({
            success: false,
            message: error.message
        })
    }

    return res.status(200).send({
        success: true,
        doubt: doubtToObj(d)
    })

});


doubtRouter.get("/history", auth, async (req, res) => {

    const { email, role } = req.body._user;

    let doubts;
    try {
        doubts = await getAllDoubts(email);
    } catch (error) {
        let code = 500;
        if (error.constructor === ResourceAbsentError) {
            code = 404;
        }
        else if (error.constructor === UserValidationError) {
            code = 400;
        }
        return res.status(code).send({
            success: false,
            message: error.message
        })
    }

    return res.status(200).send({
        success: true,
        doubts: doubts.map(d => doubtToObj(d))
    })

});


module.exports = { doubtRouter }