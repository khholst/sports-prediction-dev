export class User {
    constructor(
        public username:string,
        public password:string,
        public rooms:{room_id:string, score:number},
        public is_admin:boolean,
        public _id:string
    ) {}
}

