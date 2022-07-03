export class Room {
    constructor(
        public tournament_id: string,
        public name: string,
        public creator: string,
        public join_key: number,
        public _id:string
    ) {}
}