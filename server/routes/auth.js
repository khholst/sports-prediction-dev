const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const mongo = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();


router.post("/register", [
    //Existing username check
    check("username", "Please provide a valid username").notEmpty(),
    check("username", "Username has to be at least 8 characters").isLength({min:8}),
    check("password", "Password has to be at least 8 characters").isLength({min: 8})

], async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    //Check for any validation errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(200).json({
            "code":400,
            "errors": errors.array()
        });
    }

    //Check if password matches confirm password
    if (password != confirmPassword) {
        return res.status(200).json({
            "code": 401,
            "errors": [{
                "msg": "Passwords must match"
                }
            ]
        })
    }

    //Query users from db to validate username
    const Users = db.model('Users', 
    new mongo.Schema({ username: 'string', password: 'string', rooms: 'array', tournaments: 'array', is_admin: 'boolean'}), 
    'users');
    const user = await Users.findOne({ username: username });

    if(user) { //If username exists in db
        return res.status(200).json({
            "code": 401,
            "errors": [{
                "msg": "Username is already taken"}]
        });
    }

    //Hash the given password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create user in database
    const userz = await Users.create({username: username, password: hashedPassword, rooms: [], tournaments: [], is_admin: false});

    //Create a JSON Web Token
    const token = JWT.sign({
        username,
        is_admin: false
    }, process.env.JWTSECRET, { //this to env variable
        expiresIn: 900
    });

    console.log(token)
    //Return token
    return res.status(201).json({
        "code": 201,
        "token": token
    })
})





router.post("/login", async(req, res) => {
    const { username, password } = req.body;

    //Mongo schema
    const Users = db.model('Users', 
    new mongo.Schema({ username: 'string', password: 'string', is_admin: 'boolean' }), 
    'users');


    //Check if given username exists in database
    const user = await Users.findOne({username: username});

    if(!user) { //Username doesn't match a db entry
        return res.status(401).json({
            "code": 401,
            "errors": [
                {"msg": "Invalid credentials"}
            ]
        })
    }

    //Check if password matches user's password in database
    const isMatch = await bcrypt.compare(password, user.password);

    //Return error if password doesn't match
    if(!isMatch) {
        return res.status(401).json({
            "code": 401,
            "errors": [
                {"msg": "Invalid credentials"}
            ]
        })
    }

    //Create JSON Web Token and send it to the client
    const token = JWT.sign({
        username: username,
        admin: user.is_admin
    }, process.env.JWTSECRET, {
        expiresIn: 1000
    });

    console.log(token)
    return res.status(200).json({
        "code": 200,
        "token": token
    })
})


module.exports = router;