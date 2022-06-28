import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private tourUrl: string = "http://localhost:8080/tournaments";

  constructor(private http: HttpClient) { };

  async getTournaments():Promise<any> {
    return await lastValueFrom(this.http.get(`${this.tourUrl}`))
  }

}
