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

  async findRoomByKey(room_key: string): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.roomUrl}/key?key=${room_key}`, httpOptions));
  }

  async joinRoom(room_id: string): Promise<any> {
    return await lastValueFrom(this.http.post(`${this.roomUrl}/join`, {room_id: room_id}, httpOptions));
  }
}
