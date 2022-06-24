const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

router.post("/register", [
    //Existing username check
    check("username", "Please provide a valid username").notEmpty(),
    check("username", "Username has to contain alphabetical characters").isAlphanumeric(),
    check("username", "Username has to be at least 8 characters").isLength({min:8}),
    check("password", "Password has to be at least 8 characters").isLength({min: 8})

], async (req, res) => {
    console.log("REGISTERING IN BACKEND");
    const { username, password, confirmPassword } = req.body;
    console.log(username, password, confirmPassword)

    //VALIDATE INPUT
    const errors = validationResult(req);
    console.log(errors)
    //If there are any validation errors
    if(!errors.isEmpty()) {
        return res.status(200).json({
            "code":400,
            "errors": errors.array()

        })
    }

    //Password matches confirm password
    if (password != confirmPassword) {
        return res.status(200).json({
            "code": 400,
            "errors": [{
                "msg": "Passwords must match"
                }
            ]
        })
    }

    //VALIDATE NEW USERNAME
    ///
    ///
    let hasdhedPassword = await bcrypt.hash(password, 10);
    console.log(hasdhedPassword);

    const token = await JWT.sign({
        username
    }, "843sdjfe8feihsdnshfue9fuf8aw0ndd", { //this to env variable
        expiresIn: 1000
    });

    return res.status(201).json({
        "code": 201,
        "token": token
    })
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