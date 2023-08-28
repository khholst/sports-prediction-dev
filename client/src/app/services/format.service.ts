import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatService {

  constructor() { }

  public dateStringToText(dateString: string, time:boolean): string {
    const monthLookup: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                                  "October", "November", "December"];
    const date = new Date(dateString);
    if (!time) {
      return `${date.getDate()}. ${monthLookup[date.getMonth()]}`
    } else {
      return`${date.getDate()}. ${monthLookup[date.getMonth()]} ${date.getHours().toString().replace(/^0$/,"00")}:${date.getMinutes().toString().replace(/^0$/,"00")}`
    }
  };
}
