const mongo = require("mongoose");

const gamesSchema = {team1: 'string', team2: 'string', score1: 'number', score2: 'number', time: 'date', tournament_id: 'ObjectID',  _id:'ObjectID'};
const tournamentSchema = {_id: 'ObjectId', start_date: 'string', end_date: 'string',  name: 'string', img_url: 'string', sport: 'string'};

exports.save = (async (req, res) => {
    const result = req.body;

    try {
        let Games = db.model('Games',
            new mongo.Schema(gamesSchema), 'games');
    
        //Add prediction to user document
        const saveResults = await Games.updateOne(
            { _id: result._id },
            {
                "$set": {
                    "score1": result.score1, 
                    "score2": result.score2
                },
            }
        );
        res.status(200).json({
            msg: "Prediction saved"
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({});
    }
    
})