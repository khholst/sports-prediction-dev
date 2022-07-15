export class User {
    constructor(
        public username:string,
        public password:string,
        public rooms:[string],
        public is_admin:boolean,
        public _id:string,
        public tournaments: [{
            tournament_id:string, scores: [number], predictions: [{
                game_id: string, score1: number, score2: number, points: number
            }]
        }]
    ) {}
}
