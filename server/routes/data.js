const router = require("express").Router();
const mongo = require("mongoose");

router.get("/tournaments", async(req, res) => {
    let tours = db.model('Tournaments', 
        new mongo.Schema({ tournament_id: 'number', name: 'string' }), 'tournaments'); 

    tours.find({}, function(err, data) { 
        if(err){console.log(err);}
        else{res.json(data);}; 
    });
});

router.get("/countries", async(req, res) => {
    let counts = db.model('Countries', 
        new mongo.Schema({ country_id: 'string', name: 'string' }), 'countries'); 

    counts.find({}, function(err, data) { 
        if(err){console.log(err);}
        else{res.json(data);}; 
    });
});

router.get("/games", async(req, res) => {
    let games = db.model('Games',
        new mongo.Schema({team1: 'string', team2: 'string', score1: 'number', score2: 'number', 
            game_id: 'number', time: 'date', tournament_id: 'number'}), 'games');

    games.find(req.query,function(err, data) {
        if(err){console.log(err);}
        else{res.json(data);};
    })
});

module.exports = router;