const mongo = require("mongoose");

const gamesSchema = {team1: 'string', team2: 'string', score1: 'number', score2: 'number', time: 'date', tournament_id: 'ObjectID',  _id:'ObjectID'};

exports.save = (async (req, res) => {
    const result = req.body;

    try {
        let Games = db.model('Games',
            new mongo.Schema(gamesSchema), 'games');

        const predictionsSchema = new mongo.Schema({
            game_id: {
                type: mongo.Schema.ObjectId,
                ref: "Games"
            },
            score1: Number,
            score2: Number,
            points: Number
        });

        const tournamentsSchema = new mongo.Schema({
            predictions: [predictionsSchema],
            tournament_id: {type: mongo.Schema.Types.ObjectId, ref: "Tournaments"},
            scores: Array
        });
    
        let Users = db.model('Users',
            new mongo.Schema({username: 'string', password: 'string', rooms: 'array', tournaments: [tournamentsSchema], is_admin: 'boolean',  _id:'ObjectId'}), 'users');
        
        const saveResults = await Games.updateOne(
            { _id: result._id },
            {
                "$set": {
                    "score1": result.score1, 
                    "score2": result.score2
                }
            }
        );

        const savePredictionPoints = await Users.bulkWrite([
            { "updateMany": {
                "filter":{},
                "update": {
                    "$set": {"tournaments.$[tournament].predictions.$[prediction].points": 3},
                    //"$push": {"tournaments.$[tournament].scores": 3} Siin peaks scores arraysse n-1 + 3 punkti lisama 
                },
                "arrayFilters": [
                    { "tournament.tournament_id": mongo.Types.ObjectId(result.tournament_id) },
                    { "prediction.game_id": mongo.Types.ObjectId(result._id),
                     "prediction.score1": result.score1,
                    "prediction.score2": result.score2}
                ]
            }}
            //Siia peaksid siis teised updateMany'd tulema, aga ma ei suuda neid välja mõleda :(
        ]);

        res.status(200).json({
            msg: "Result saved"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({});
    };


    
})