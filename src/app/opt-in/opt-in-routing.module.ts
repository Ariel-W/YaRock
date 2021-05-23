import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OptInPage } from './opt-in.page';

const routes: Routes = [
  {
    path: '',
    component: OptInPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OptInPageRoutingModule {}
