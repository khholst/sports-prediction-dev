const mongo = require("mongoose");
const schema = require("./schemas")




exports.newTournament = (async(req, res) => {
    const Tournaments = db.model('Tournaments', 
        new mongo.Schema({ name: 'string', start_date: 'string', end_date: 'string', img_url: 'string', num_games:'number', host:'array', sport: 'string' }), 'tournaments'); 

    try {
        const newTournament = await Tournaments.create(req.body);

        res.status(201).json({
            code: 201,
            msg: "Tournament created",
        });

    } catch (error) {
        res.status(500).json({
            code: 500,
            errors: [{
                msg: "Something went wrong with the request"
            }]
        })
    }
})


exports.newGame = (async(req, res) => {

    try {
        const User = db.model('Users', new mongo.Schema(schema.user), 'users');
        const Games =   db.model('Games', new mongo.Schema(schema.game), 'games');

        req.body.tournament_id = req.params.id;
        const addedGame = await Games.create(req.body);

        const newPrediction = getNewPrediction(addedGame._id)
        
        // Add new game to user predictions
        const saveGameInPredictions = await User.updateMany(
            {  },
            {
                "$push": {
                    "tournaments.$[tournament].predictions": newPrediction, 
                },
            },
            { "arrayFilters": [
                { "tournament.tournament_id": mongo.Types.ObjectId(req.params.id) },
            ]}
        )

        res.status(201).json({
            code: 201,
            msg: "Game added",
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            code: 500,
            errors: [{
                msg: "Something went wrong with the request"
            }]
        });
    }
})


exports.newSpecial = (async(req, res) => {
    
    try {
        const User = db.model('Users', new mongo.Schema(schema.user), 'users');
        
    } catch (error) {
        res.status(500).json({
            code: 500,
            errors: [{
                msg: "Something went wrong with the request"
            }]
        });
    }
})


function getNewPrediction(game_id) {
    return {
        game_id: game_id,
        score1: -1,
        score2: -1,
        points: -999,
        winner: -1
    }
}