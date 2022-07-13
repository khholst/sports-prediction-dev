const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const mongo = require("mongoose");


//Add new room to database
exports.new = (async (req, res) => {
    const { name, tournament } = req.body;

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
    new mongo.Schema({ name: 'string', tournament_id: 'objectId', creator: 'string', join_key: 'string'}), 
    'rooms');

    //Construct room object to be added to the database
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
        room_id: createdRoom._id,
        score: 0
    }

    const user = await Users.findOneAndUpdate({ username: username },
        { $push: { rooms: room }});


    return res.status(201).json({
        code: 201,
        join_key: joinKey,
        room_id: createdRoom._id
    })
})


exports.findByKey = (async (req, res) => {
    //Room schema
    const Rooms = db.model('Rooms', 
    new mongo.Schema({ name: 'string', tournament_id: 'objectId', creator: 'string', join_key: 'string'}), 
    'rooms');

    //Find room
    const room = await Rooms.findOne({join_key: req.params.key});

    //Users schema
    const Users = db.model('Users',
    new mongo.Schema({username: 'string', _id:'objectId', rooms:'array'}), 'users');

    //Torunaments schema
    const Tournaments = db.model('Users',
    new mongo.Schema({name: 'string', _id:'objectId', sport: 'string'}), 'tournaments');

    let members = 0;
    if (room) {
        members = await Users.countDocuments({"rooms.room_id": room._id});
        const tournament = await Tournaments.findOne({_id: room.tournament_id})

        res.status(200).json({
            code: 200,
            name: room.name,
            tournament: tournament.name,
            sport: tournament.sport,
            creator: room.creator,
            members: members,
            _id: room._id
        });
    } else {
        res.status(404).json({
            code: 404,
            errors: [
                {
                    msg: "Room not found"
                }
            ]
        });
    }
})

exports.join = (async (req, res) => {
    const room_id = mongo.Types.ObjectId(req.params.id);

    const room = {
        room_id: room_id,
        score: 0
    }

    const Users = db.model('Users',
    new mongo.Schema({username: 'string', _id:'objectId', rooms:'array'}), 'users');
    
    const jwtPayload = req.get("token").split(".")[1];
    const username = JSON.parse(Buffer.from(jwtPayload, "base64").toString("utf-8")).username;


    const user = await Users.findOne({username: username});
    const userInRoom = user.rooms.some(room => room.room_id.equals(room_id));

    if (userInRoom) {
        res.status(403).json({
            code: 403,
            errors: [{
                msg: "You have already joined this room"
            }]
        })

    } else {
        const userUpdate = await user.updateOne({$push: {rooms: room}})
        res.status(201).json({
            code: 201,
            message: "Room joined successfully",
            room_id: room_id
        })
    }
})

exports.all = (async (req, res) => {
    const username = req.params.username;

    let userRooms = db.model('Users',
    new mongo.Schema({username: 'string', password: 'string', rooms: 'array', is_admin: 'boolean',  _id:'ObjectId'}), 'users');
    const userRoomIds = await userRooms.findOne({username: username}, {rooms:1, _id: 0});
    let roomIds = [];

    for (let room of userRoomIds.rooms){
      roomIds.push(room.room_id);
    };

    const rooms = db.model('Rooms',
    new mongo.Schema({ tournament_id: 'string', _id: 'ObjectId', name: 'string', creator: 'string', join_key: 'number' }), 'rooms');

    const roomData = await rooms.find({"_id" : { "$in": roomIds }});

    res.status(200).json(roomData);
})

exports.room = (async (req, res) => {
    console.log(req.params)
    const room_id = mongo.Types.ObjectId(req.params.id);
    const rooms = db.model('Rooms',
        new mongo.Schema({ tournament_id: 'string', _id: 'ObjectId', name: 'string', creator: 'string', join_key: 'number' }), 'rooms');

    const roomData = await rooms.find({"_id": room_id});

    res.status(200).json(roomData);
})

exports.roomUsers = (async (req, res) => {
    const subschema = new mongo.Schema({room_id:'ObjectID', score:'number'});
    let userRooms = db.model('Users',
        new mongo.Schema({_id:'ObjectId', username: 'string', rooms:[subschema]}), 'users')

    userRooms.find({"rooms.room_id": { "$in": req.query.room.split(",") }},function(err, data) {
        if(err){console.log(err);}
        else{
            for(let i=0;i<data.length;i++){
                data[i].rooms = data[i].rooms.filter(function(room){return req.query.room.split(",").includes(room.room_id.toString())});
            };
            data = data.map((user) => {
                return {
                  '_id':user._id,
                  'username':user.username,
                  'rooms':user.rooms,
                };
              });            
            res.json(data);
        };
    });
})