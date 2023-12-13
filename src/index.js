
require('dotenv').config();
var cron = require('node-cron');

const { sequelize } = require("./config/db");
const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user.routes');
const { doubtRouter } = require('./routes/doubt.routes');
const { Doubt } = require('./model/doubt.model');
const { Student, Tutor } = require('./model/user.model');
const { registerNewUser } = require('./service/user.service');
const { createDoubt, assignedDoubt, handleDoubt, getAllDoubts, doubtAssignmentScheduler } = require('./service/doubt.service');
const { pingedUsers } = require('./singleton/singleton');
const app = express();

sequelize.sync({ force: true, alter: true });

sequelize.authenticate()
    .then(() => {
        app.use(cors());
        app.use(express.json());
        app.use("/api/v1/user", userRouter);
        app.use("/api/v1/doubt", doubtRouter);

        app.all("*", (req, res) => {
            return res.status(404).json({
                status: "fail",
                message: "Route Not Found"
            })
        })

        app.listen(process.env.PORT, async () => {

            try {
                console.log('Connection has been established successfully.');
            } catch (error) {
                console.log(error);
            }
        });
    })

// .then(() => {

//     setTimeout(async () => {
//         let s = new Student();
//         s.name = 's';
//         s.email = 's@2.com';
//         s.password = 's';
//         s.language = 'Hindi';
//         s.role = 'student';
//         s.grade = 1;
//         s = await registerNewUser(s);

//         let t = new Tutor();
//         t.name = 'k';
//         t.email = 'k@1.com';
//         t.password = 'k';
//         t.language = 'Hindi';
//         t.role = 'tutor';
//         t.assignedGradesSubjects = new Map();
//         t.assignedGradesSubjects.set(1, ['Math']);
//         t = await registerNewUser(t);

//         let d = new Doubt();
//         d.doubtSubject = 'a';
//         d.doubtDescription = 'xxx';

//         d = await createDoubt(d, s.email);

//         d = await assignedDoubt(d.id, t.email);

//         d= await handleDoubt(d.id, 'solved', t.email);

//         console.log(await getAllDoubts(s.email));
//         console.log(await getAllDoubts(t.email));
//     }, 2000);
// })



cron.schedule('* * * * * *', async () => {

    for (let user of pingedUsers) {
        if ((Date.now() - user._lastpingedtime) > 3000) {
            pingedUsers.delete(user);
        }
    }
    doubtAssignmentScheduler(pingedUsers);
})
