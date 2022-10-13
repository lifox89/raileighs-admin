import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsSummaryComponent } from './items-summary/items-summary.component';
import { OrdersSummaryComponent } from './orders-summary/orders-summary.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: $localize`Today's Sales`
    },
    children: [
      {
        path: 'items',
        component: ItemsSummaryComponent
      },
      {
        path: 'orders',
        component: OrdersSummaryComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
