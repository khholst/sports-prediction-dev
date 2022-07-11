import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { Room } from '../room';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  public roomUsers: User[] = [];
  public roomName: string = "";

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService
  ) { }

  ngOnInit(): void {
    this.onRoomRequest();
  };

  async onRoomRequest(){
    const roomID: string = this.route.snapshot.paramMap.get("id")!;
    const room = await this.roomService.getRoom(roomID);
    this.roomName = room[0].name
    this.roomUsers = await this.roomService.getRoomUsers([roomID]);
    this.roomUsers.sort(
      (firsUser: User, secondUser: User) =>
        (firsUser.rooms[0].score > secondUser.rooms[0].score) ? -1 : 1
    );
  };

}
