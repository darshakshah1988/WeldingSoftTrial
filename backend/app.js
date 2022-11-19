require("dotenv").config();
const bodyParser = require("body-parser");
const app = require("express")();
const cors = require("cors");
const sequelize = require("./database/database-connection");
const APIRoute = require("./Route/ApiRoute") 

//syncing the database modesels
sequelize.sync();
app.listen(process.env.PORT, () => console.log("i have started listening" + process.env.PORT));

app.use(bodyParser());
app.use(cors());

app.use("/api", APIRoute);
