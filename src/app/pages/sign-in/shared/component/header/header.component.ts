import { Component, OnInit, Input  } from '@angular/core';
import { UtilidadesService } from 'src/app/services/utilidades.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() backButton!: string;
  @Input() isModal!: boolean;

  constructor(private utilService: UtilidadesService) { }

  ngOnInit() {}
  
  closeModal(){
    this.utilService.closeModal();
  }
}
