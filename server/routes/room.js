const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const mongo = require("mongoose");
const { v4: uuidv4 } = require('uuid');


router.post("/new", [
    //Existing username check
    check("name", "Please provide a room name").notEmpty(),
    check("tournament", "Please provide a tournament").notEmpty()
], async (req, res) => {
    const { name, tournament } = req.body;
    console.log(name, tournament);

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(200).json({
            "code": 400,
            "errors": errors.array()
        });
    }



    const randomString = uuidv4();

    //Schema for rooms collection
    const Rooms = db.model('Rooms', 
    new mongo.Schema({ name: 'string', tournament_id: 'number', creator: 'array', join_key: 'boolean'}), 
    'rooms');




    
    const newRoom = {
        name: name,
        tournament_id: tournament,
        creator: "kakakaka",
        join_key: randomString
    }



    return res.json({
        join_key: randomString
    })



})




module.exports = router;