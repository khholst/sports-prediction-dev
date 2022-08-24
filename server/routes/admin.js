const router = require("express").Router();
const mongo = require("mongoose");


router.post("/tournaments/new", async (req, res) => {
    console.log(req.body)

    const Tournaments = db.model('Tournaments', 
        new mongo.Schema({ name: 'string', start_date: 'string', end_date: 'string', img_url: 'string', num_games:'number', sport: 'string' }), 'tournaments'); 

    const newTournament = await Tournaments.create(req.body);

    res.status(200).json({
        "lol": "lol"
    })
})



module.exports = router;