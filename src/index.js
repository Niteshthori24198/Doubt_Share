
require('dotenv').config();

const { sequelize } = require("./config/db");
const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user.routes');
const app = express();


sequelize.authenticate()
    .then(() => {
        sequelize.sync();
        app.use(cors());
        app.use(express.json());
        app.use("/api/v1/user", userRouter);

        app.all("*", () => {
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
    });
