const mongo = require("mongoose");

const gamesSchema = {team1: 'string', team2: 'string', score1: 'number', score2: 'number', time: 'date', tournament_id: 'ObjectID',  _id:'ObjectID'};
const tournamentSchema = {_id: 'ObjectId', start_date: 'string', end_date: 'string',  name: 'string', img_url: 'string', sport: 'string'};


exports.all = (async(req, res) => {

    let Games = db.model('Games',
    new mongo.Schema(gamesSchema), 'games');


    const dbTournaments = db.model('Tournaments', new mongo.Schema(tournamentSchema), 'tournaments');


    const predictionsSchema = new mongo.Schema({
        game_id: {
            type: mongo.Schema.ObjectId,
            ref: "Games"
        },
        score1: Number,
        score2: Number,
        points: Number
    })

    const tournamentsSchema = new mongo.Schema({
        predictions: [predictionsSchema],
        tournament_id: {type: mongo.Schema.Types.ObjectId, ref: "Tournaments"},
        scores: Array
    })

    let User = db.model('Users',
    new mongo.Schema({username: 'string', password: 'string', rooms: 'array', tournaments: [tournamentsSchema], is_admin: 'boolean',  _id:'ObjectId'}), 'users');


    try {
        const userPredictions = await User.findOne({username: "rääbis123"})
                              .populate("tournaments.predictions.game_id")
                              .populate("tournaments.tournament_id");


        res.status(200).json({
            predictions: userPredictions.tournaments
        })
    } catch (error) {
        console.log(error)
    }


})