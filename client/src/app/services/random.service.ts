import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RandomService {
  private randomUrl: string = `${environment.serverUrl}/random/generate`;
  constructor(
    private http: HttpClient
  ) { }

  async generateName() {
    return await lastValueFrom(this.http.get(this.randomUrl));
  }
}
