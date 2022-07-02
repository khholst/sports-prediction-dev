export class Game {
    constructor(
        public team1:string,
        public team2:string,
        public score1:number,
        public score2:number,
        public game_id:number,
        public tournament_id:number,
        public time:string,
        public stage:string,
        public _id:string
    ) {}
}