const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
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
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);


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


const user = {
    username: "kasutaja",
    password: "$2b$10$OBE5pbDc7WTseTm3S2RQ6.nLxCPAFkPaqmogetyzx9kWRjaKs.YbG"
}

router.post("/login", async(req, res) => {
    const { username, password } = req.body;

    if(username != user.username) {
        return res.status(401).json({
            "code": 401,
            "errors": [
                {"msg": "Invalid credentials"}
            ]
        })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        return res.status(401).json({
            "code": 401,
            "errors": [
                {"msg": "Invalid credentials"}
            ]
        })
    }

    const token = await JWT.sign({
        username
    }, "843sdjfe8feihsdnshfue9fuf8aw0ndd", {
        expiresIn: 1000
    });
    res.json(token);
})





module.exports = router;