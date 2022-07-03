const router = require("express").Router();
const { response } = require("express");
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



    const joinKey = uuidv4(); //Generate random join key for the room

    //Decode payload from the JWT token
    const jwtPayload = req.get("token").split(".")[1];
    const username = JSON.parse(Buffer.from(jwtPayload, "base64").toString("utf-8")).username;

    //Schema for rooms collection
    const Rooms = db.model('Rooms', 
    new mongo.Schema({ name: 'string', tournament_id: 'number', creator: 'string', join_key: 'string'}), 
    'rooms');

    
    const newRoom = {
        tournament_id: tournament,
        name: name,
        creator: username,
        join_key: joinKey
    }

   const createdRoom = await Rooms.create(newRoom);


    //Schema for users collection
    const Users = db.model('Users', 
    new mongo.Schema({ username: 'string', rooms: 'array'}), 
    'users');

    const room = {
        room_key: createdRoom._id,
        score: 0
    }

    const user = await Users.findOneAndUpdate({ username: username },
        { $push: { rooms: room }});




    console.log(user)

    return res.json({
        join_key: joinKey
    })



})




module.exports = router;