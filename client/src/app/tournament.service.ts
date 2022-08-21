import { HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  constructor() { }
}
