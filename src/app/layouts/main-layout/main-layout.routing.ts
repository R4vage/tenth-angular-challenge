import { MainLayoutComponent } from './main-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('../../home/home.module').then((mod) => mod.HomeModule),
        data: { animation: 'first', preload: true, delay: false}
      },
      {
        path: 'cart',
        pathMatch: 'full',
        loadChildren: () =>
          import('../../cart/cart.module').then((mod) => mod.CartModule),
        data: { animation: 'second', preload: true, delay: true}
      }
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
