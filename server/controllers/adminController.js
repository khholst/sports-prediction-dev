const mongo = require("mongoose");




exports.newTournament = (async(req, res) => {
    const Tournaments = db.model('Tournaments', 
        new mongo.Schema({ name: 'string', start_date: 'string', end_date: 'string', img_url: 'string', num_games:'number', sport: 'string' }), 'tournaments'); 

    try {
        const newTournament = await Tournaments.create(req.body);

        res.status(201).json({
            code: 201,
            msg: "Tournament created",
        })
    } catch (error) {
        res.status(500).json({
            code: 500,
            errors: [{
                msg: "Something went wrong with the request"
            }]
        })
    }
})