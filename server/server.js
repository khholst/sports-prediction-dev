const express = require('express')
const cors = require("cors");
const auth = require("./routes/auth");
const data = require("./routes/data");
const path = require("path");
const bodyParser = require("body-parser");
const mongo = require("mongoose");

const db_uri = "mongodb+srv://appuser:gaZsPDffU2MnFDpu0B3q@sports-prediction-dev.tpeof.mongodb.net/sports_prediction?retryWrites=true&w=majority";
global.db = (global.db ? global.db : mongo.createConnection(db_uri));

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", auth);
app.use("/data", data);

app.use(function (req, res, next){
  res.setHeader('Access-Control-Allow-Origin','http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods','GET, POST');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials',true);
next();
})

app.get("/", (req, res) => {
  res.send("lol route working")
})

app.listen(8080, () => {
  console.log("Running on port 8080");
});
