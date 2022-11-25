require("dotenv").config();
const route = require("express").Router();
const { Router } = require("express");
const bodyParser = require("body-parser");
const app = require("express")();
const cors = require("cors");
const sequelize = require("./database/database-connection");
const APIRoute = require("./Route/ApiRoute") 
const cron  = require('node-cron');
const shell = require('shelljs');
const controller = require("./Controller/ApiController");
//syncing the database modesels
sequelize.sync();
app.listen(process.env.PORT, () => console.log("i have started listening" + process.env.PORT));

app.use(bodyParser());
app.use(cors());

app.use("/api", APIRoute);


cron.schedule("*/20 * * * * *", ()=> {         // CRON time and occurances change  visit crontab.guru
    let data = controller.crondataTrial();
    console.log(data);
},{
    timezone: "Asia/Kolkata"
});
