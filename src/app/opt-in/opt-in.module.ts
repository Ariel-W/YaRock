import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OptInPageRoutingModule } from './opt-in-routing.module';

import { OptInPage } from './opt-in.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OptInPageRoutingModule
  ],
  declarations: [OptInPage]
})
export class OptInPageModule {}
