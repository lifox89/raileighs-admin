import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartsComponent } from './charts/charts.component';
import { ForecastsComponent } from "./forecasts/forecasts.component";
import { ItemsSummaryComponent } from './items-summary/items-summary.component';
import { OrdersSummaryComponent } from './orders-summary/orders-summary.component';
import { ReportsComponent } from "./reports/reports.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'items',
        component: ItemsSummaryComponent,
        data: {
          title: $localize`Today's Item Sales`
        },
      },
      {
        path: 'orders',
        component: OrdersSummaryComponent,
        data: {
          title: $localize`Today's Orders`
        },
      },
      {
        path: 'reports',
        component: ReportsComponent,
        data: {
          title: $localize`Reports`
        },
      },
      {
        path: 'charts',
        component: ChartsComponent,
        data: {
          title: $localize`Reports`
        },
      },
      {
        path: 'forecasts',
        component: ForecastsComponent,
        data: {
          title: $localize`Reports`
        },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
