export class Tournament {
    constructor(
        public name:string,
        public start_date:string,
        public end_date:string,
        public img_url:string,
        public _id:string,
        public sport:string,
        public host: Array<string>
    ) {}
}