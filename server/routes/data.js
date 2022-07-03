const router = require("express").Router();
const mongo = require("mongoose");

router.get("/tournaments", async(req, res) => {
    let tours = db.model('Tournaments', 
        new mongo.Schema({ name: 'string', _id:'string' }), 'tournaments'); 

    tours.find({}, function(err, data) { 
        if(err){console.log(err);}
        else{res.json(data);}; 
    });
});

router.get("/countries", async(req, res) => {
    let counts = db.model('Countries', 
        new mongo.Schema({ country_id: 'string', name: 'string',  _id:'string' }), 'countries'); 

    counts.find({}, function(err, data) { 
        if(err){console.log(err);}
        else{res.json(data);}; 
    });
});

router.get("/games", async(req, res) => {
    let games = db.model('Games',
        new mongo.Schema({team1: 'string', team2: 'string', score1: 'number', score2: 'number', 
            time: 'date', tournament_id: 'ObjectID',  _id:'ObjectID'}), 'games');

    games.find(req.query,function(err, data) {
        if(err){console.log(err);}
        else{res.json(data);};
    })
});

router.get("/userRooms", async(req, res) => {
    let userRooms = db.model('Users',
        new mongo.Schema({username: 'string', password: 'string', rooms: 'array', is_admin: 'boolean',  _id:'string'}), 'users');

    userRooms.find(req.query,function(err, data) {
        if(err){console.log(err);}
        else{
            res.json(data[0].rooms);
        };
    })
});

router.get("/rooms", async(req, res) => {
    console.log()
    let rooms = db.model('Rooms',
        new mongo.Schema({
            tournament_id: 'string', room_id: 'number', name: 'string', creator: 'string', join_key: 'number'}), 'rooms');
    rooms.find({"_id" : { "$in": req.query.room_id.split(",") }},function(err, data) {
        if(err){console.log(err);}
        else{
            res.json(data);
        };
    })
});

module.exports = router;