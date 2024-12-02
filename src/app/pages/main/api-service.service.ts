import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private url: string = 'https://api.imgflip.com/get_memes'
  constructor(private http: HttpClient) { }

  obtenerMemes() {
    return this.http.get(this.url);
  }
}
