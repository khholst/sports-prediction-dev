const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

router.post("/register", [
    //Existing username check
    check("username", "Please provide a valid username").notEmpty(),
    check("username", "Username has to contain alphabetical characters and no spaces").isAlphanumeric(),
    check("password", "Password has to be at least 6 characters").isLength({min: 6})

], async (req, res) => {
    const { username, password } = req.body;

    //VALIDATE INPUT
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    //VALIDATE NEW USERNAME
    console.log(username, password)

    let hasdhedPassword = await bcrypt.hash(password, 10);
    console.log(hasdhedPassword);

    const token = await JWT.sign({
        username
    }, "843sdjfe8feihsdnshfue9fuf8aw0ndd", {
        expiresIn: 1000
    });
    res.json(token);
})




router.post("/login", async(req, res) => {
    const { username, password } = req.body;

    const isMatch = await bcrypt.compare(password, "$2b$10$Worq949R7G1MUxHuY3e6OeTxAuBtMpJCt7jZ2UPSpsFMB8Xo3UYaC");
    console.log(isMatch);

    const token = await JWT.sign({
        username
    }, "843sdjfe8feihsdnshfue9fuf8aw0ndd", {
        expiresIn: 1000
    });
    res.json(token);
})





module.exports = router;