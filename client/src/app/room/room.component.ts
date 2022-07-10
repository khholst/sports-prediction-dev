import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  public roomUsers: User[] = [];
  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService
  ) { }

  ngOnInit(): void {
    this.onRoomRequest();
  };

  async onRoomRequest(){
    let roomID: string = this.route.snapshot.paramMap.get("id")!;
    this.roomUsers = await this.roomService.getRoomUsers([roomID]);
    this.roomUsers.sort(
      (firsUser: User, secondUser: User) =>
        (firsUser.rooms[0].score > secondUser.rooms[0].score) ? -1 : 1
    );
  };

}
