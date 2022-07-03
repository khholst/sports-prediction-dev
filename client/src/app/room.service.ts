import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Room } from './room';
import { lastValueFrom } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private roomUrl = "http://localhost:8080/api/rooms"

  constructor(
    private http: HttpClient
  ) { }

  async createNewRoom(room: Room): Promise<any> {
    return await lastValueFrom(this.http.post(`${this.roomUrl}/new`, room, httpOptions));
  }


}
