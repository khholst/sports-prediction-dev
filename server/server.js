const express = require('express')
const cors = require("cors");
const auth = require("./routes/auth");

const app = express();


app.use(express.json());
app.use(cors());
app.use("/auth", auth);


app.get("/", (req, res) => {
  res.send("lol route working")
})


app.listen(8080, () => {
  console.log("Running on port 8080");
});