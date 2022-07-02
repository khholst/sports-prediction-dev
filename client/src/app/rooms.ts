export class Room {
    constructor(
        public tournament_id: string,
        public room_id: number,
        public name: string,
        public creator: string,
        public join_key: number
    ) {}
}