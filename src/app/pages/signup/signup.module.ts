import { NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { EstadoService } from 'src/services/domain/estado.service';
import { CidadeService } from 'src/services/domain/cidade.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SignupPageRoutingModule
  ],
  declarations: [SignupPage],
  providers: [
    CidadeService,
    EstadoService
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SignupPageModule {}
