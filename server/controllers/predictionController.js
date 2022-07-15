const mongo = require("mongoose");

exports.all = (async(req, res) => {

    let User = db.model('Users',
    new mongo.Schema({username: 'string', password: 'string', rooms: 'array', tournaments: 'array', is_admin: 'boolean',  _id:'ObjectId'}), 'users');

    let Games = db.model('Games',
    new mongo.Schema({team1: 'string', team2: 'string', score1: 'number', score2: 'number', 
        time: 'date', tournament_id: 'ObjectID',  _id:'ObjectID'}), 'games');


    try {
        const user = await User.findOne({username: "tibulinnu"});
        console.log(user.tournaments[0].predictions)        
    } catch (error) {
        console.log(error)
    }


    res.send("predictions requested")
})