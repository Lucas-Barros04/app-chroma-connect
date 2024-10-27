import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './componentes/menu/menu.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [MenuComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule ],
  exports: [MenuComponent]
})
export class SharingModule { }
