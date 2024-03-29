export class Room {
    constructor(
        public tournament_id: string = "",
        public name: string = "",
        public creator: string = "",
        public join_key: string = "",
        public _id: string = "",
        public tournament: string = "",
        public start_date: string = "",
        public end_date: string = "",
        public status: string = "",
        public numUsers: number = 0,
        public timeUntil: number = 0,
        public userPos: number = 0,
        public leader: string = "",
        public num_games: number = 0
    ) {}
}