const mongo = require("mongoose");

exports.all = (async(req, res) => {

    let Games = db.model('Games',
    new mongo.Schema({team1: 'string', team2: 'string', score1: 'number', score2: 'number', 
        time: 'date', tournament_id: 'ObjectID',  _id:'ObjectID'}), 'games');


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
        tournament_id: mongo.Schema.Types.ObjectId,
        scores: Array
    })

    let User = db.model('Users',
    new mongo.Schema({username: 'string', password: 'string', rooms: 'array', tournaments: [tournamentsSchema], is_admin: 'boolean',  _id:'ObjectId'}), 'users');



    const lol = await User.find({username: res.locals.decocedToken.username})
    .populate("tournaments.predictions.game_id")

    console.log(lol.tournaments[0].predictions)


    try {
        const user = await User.findOne({username: "tibulinnu"});
        //console.log(user.tournaments[0].predictions)        
    } catch (error) {
        console.log(error)
    }


    res.send("predictions requested")
})