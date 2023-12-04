import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotoModalPage } from './photo-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PhotoModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotoModalPageRoutingModule {}
