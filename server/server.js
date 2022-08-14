const express = require('express')
const cors = require("cors");
const dotenv = require("dotenv");
const mongo = require("mongoose");

const auth = require("./routes/auth");
const data = require("./routes/data");
const room = require("./routes/room");
const admin = require("./routes/admin");
const predictions = require("./routes/predictions");


const app = express();
dotenv.config();

const db_uri = process.env.MONGOCONNECTION;
global.db = (global.db ? global.db : mongo.createConnection(db_uri));




app.use(express.json());
app.use(cors());
app.use("/auth", auth);
app.use("/data", data);
app.use("/api/rooms", room);
app.use("/api/predictions", predictions);
app.use("/api/admin", admin);



app.use(function (req, res, next){
  res.setHeader('Access-Control-Allow-Origin','http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods','GET, POST');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials',true);
next();
})


app.listen(8080, () => {
  console.log("Running on port 8080");
});
