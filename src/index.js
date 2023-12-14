
require('dotenv').config();
var cron = require('node-cron');

const { sequelize } = require("./config/db");
const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user.routes');
const { doubtRouter } = require('./routes/doubt.routes');
const { doubtAssignmentScheduler } = require('./service/doubt.service');
const { pingedUsers } = require('./singleton/singleton');
const app = express();

sequelize.sync().then(() => {

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
});



cron.schedule('* * * * * *', async () => {

    for (let user of pingedUsers) {
        if ((Date.now() - user._lastpingedtime) > 3000) {
            pingedUsers.delete(user);
        }
    }
    doubtAssignmentScheduler(pingedUsers);
})
