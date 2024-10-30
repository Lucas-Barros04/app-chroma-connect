import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../api-service.service';

@Component({
  selector: 'app-api-memes',
  templateUrl: './api-memes.component.html',
  styleUrls: ['./api-memes.component.scss'],
})
export class ApiMemesComponent  implements OnInit {
  memes: any = [];
  constructor(private apiMeme: ApiServiceService) { }

  ngOnInit() {
    const obtenerLocalMemes = localStorage.getItem('memes') 
    if(obtenerLocalMemes){
      const _obtenerLocalMemes = JSON.parse(obtenerLocalMemes);
      this.memes = _obtenerLocalMemes
      console.log('Usando datos locales')
    }else{
      this.apiMeme.obtenerMemes().subscribe((response:any)=>{
        this.memes = response.data.memes
        console.log('Usando la api memes')
        localStorage.setItem('memes', JSON.stringify(this.memes))
      })
    }
    
  }

}
