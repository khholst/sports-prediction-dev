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
        const userCollection = db.model('Users', schema.user);
        const gameCollection =   db.model('Games', schema.game);

        req.body.tournament_id = req.params.id;
        const addedGame = await gameCollection.create(req.body);

        const newPrediction = getNewPrediction(addedGame._id)
        await addPredictionForUsers(userCollection, newPrediction, req.params.id)

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

async function addPredictionForUsers(userCollection, prediction, tournament_id, special=false) {
    let subdocument = "predictions";
    if (special) { subdocument = "special_predictions" }
    push_location = `tournaments.$[tournament].${subdocument}`

    await userCollection.updateMany({},
        {
            "$push": {
                push_location: prediction, 
            },
        },
        { "arrayFilters": [
            { "tournament.tournament_id": mongo.Types.ObjectId(tournament_id) },
        ]}
    )
}

function getNewPrediction(game_id) {
    return {
        game_id: game_id,
        score1: -1,
        score2: -1,
        points: -999,
        winner: -1
    }
}




exports.newSpecial = (async(req, res) => {
    
    try {
        const specialCollection = db.model('specials', schema.specialPrediction);
        const userCollection = db.model('users', schema.user);

        req.body.tournament_id = req.params.id;
        const newSpecial = await specialCollection.create(req.body);
        const newSpecialPrediction = getNewSpecialPrediction(newSpecial._id);

        addPredictionForUsers(userCollection, newSpecialPrediction, req.params.id, true);


        console.log(newSpecialPrediction)



        
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


function getNewSpecialPrediction(prediction_id) {
    return {
        prediction_id   : prediction_id,
        user_prediction  : "TBD",
        user_points      : "TBD"
    }
}

