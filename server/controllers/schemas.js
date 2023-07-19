const gameSchema  = {
    team1           : 'string',
    team2           : 'string',
    score1          : 'number',
    score2          : 'number', 
    time            : 'date',
    tournament_id   : 'ObjectID',
    stage           : 'string'
};
exports.game = gameSchema;



const predictionSchema = {
    game_id : {
        type    : 'ObjectID',
        ref     : 'Games'
    },
    score1  : 'number',
    score2  : 'number',
    points  : 'number'
}
exports.prediction = predictionSchema;



const specialPredictionSchema = {
    prediction      : 'string',
    points          : 'number',
    type            : 'string',
    activeUntil     : 'string',
    userPrediction  : 'string',
    userPoints      : 'number',
    result          : 'string'
}
exports.specialPrediction = specialPredictionSchema;

const tournamentUnderUserSchema = {
    predictions     : [predictionSchema],
    tournament_id   : {type: "ObjectID", ref: "Tournaments"}
}
exports.tournamentUnderUser = tournamentUnderUserSchema;


const userSchema = {
    username    : 'string',
    password    : 'string',
    rooms       : 'array',
    tournaments : [tournamentUnderUserSchema],
    is_admin    : 'boolean',
    _id         :'ObjectId'
}
exports.user = userSchema;