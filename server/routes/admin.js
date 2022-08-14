const router = require("express").Router();
const mongo = require("mongoose");


router.get("/tournaments/new", async (req, res) => {
    console.log("new tournament")
    res.send("lol")
})



module.exports = router;