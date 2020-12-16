import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdutosPageRoutingModule } from './produtos-routing.module';

import { ProdutosPage } from './produtos.page';
import { LoadingService } from 'src/services/loading.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdutosPageRoutingModule
  ],
  declarations: [ProdutosPage],
  providers: [
    LoadingService
  ]
})
export class ProdutosPageModule {}
