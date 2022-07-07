export class Room {
    constructor(
        public tournament_id: string,
        public name: string,
        public creator: string,
        public join_key: string,
        public _id: string,
        public tournament: string,
        public start_date: string,
        public end_date: string,
        public status: string,
        public numUsers: number,
        public timeUntil: number,
        public userPos: number,
        public leader: string
    ) {}
}