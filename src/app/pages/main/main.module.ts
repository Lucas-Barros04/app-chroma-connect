import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';

import { MainPage } from './main.page';
import { SharingModule } from './sharing/sharing.module';
import { HttpClientModule } from '@angular/common/http';
import { ApiServiceService } from './api-service.service';
import { ApiMemesComponent } from './sharing/componentes/api-memes/api-memes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPageRoutingModule,
    SharingModule,
    MainPageRoutingModule,
    HttpClientModule,
    
  ],
  declarations: [MainPage, ApiMemesComponent],
  providers: [ApiServiceService]
})
export class MainPageModule {}
