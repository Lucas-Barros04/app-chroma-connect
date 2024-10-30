import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
interface Meme {
  id: string
  name: string
  url: string
  width: number
  height: number
  box_count: number
  captions: number
}


@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private url: string = 'https://api.imgflip.com/get_memes'
  constructor(private http: HttpClient) { }

  obtenerMemes():Observable<Meme[]> {
    return this.http.get<Meme[]>(this.url);
  }
}
