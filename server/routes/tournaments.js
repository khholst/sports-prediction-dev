const router = require("express").Router();
const mongo = require("mongoose");

router.get("/", async(req, res) => {
    let test = db.model('Tournaments', 
        new mongo.Schema({ tournament_id: 'number', name: 'string' }), 
        'tournaments'); 

    test.find({}, function(err, data) { 
        if(err){console.log(err);}
        else(res.json(data)); 
    });
})

module.exports = router;