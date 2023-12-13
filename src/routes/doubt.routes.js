
const express = require('express');
const doubtRouter = express.Router();
const { createDoubt, assignedDoubt, handleDoubt, getAllDoubts } = require('../service/doubt.service');
const { auth } = require('../middleware/auth');
const { ResourceAbsentError } = require('../error/resource.absent.error');
const { UserValidationError } = require('../error/user.validation.error');

doubtRouter.post("/create", auth, async (req, res) => {

    const { doubtSubject, doubtDescription } = req.body;
    const { email, role } = req.body._user;

    if (!isSubjectValid(doubtSubject) || typeof doubtDescription != 'string') {
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
        doubt: d
    })
});


doubtRouter.post("/handle", auth, async (req, res) => {

});


doubtRouter.get("/history", auth, async (req, res) => { });


module.exports = { doubtRouter }