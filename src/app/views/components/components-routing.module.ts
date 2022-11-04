import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartsComponent } from './charts/charts.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ForecastsComponent } from "./forecasts/forecasts.component";
import { ItemsSummaryComponent } from './items-summary/items-summary.component';
import { OrdersSummaryComponent } from './orders-summary/orders-summary.component';
import { ReportsComponent } from "./reports/reports.component";
import { InventoriesComponent } from "./inventories/inventories.component";
import { ManageInventoryComponent } from "./manage-inventory/manage-inventory.component";

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
          title: $localize`Sales`
        },
      },
      {
        path: 'expenses',
        component: ExpensesComponent,
        data: {
          title: $localize`Expenses`
        },
      },
      {
        path: 'charts',
        component: ChartsComponent,
        data: {
          title: $localize`Charts`
        },
      },
      {
        path: 'forecasts',
        component: ForecastsComponent,
        data: {
          title: $localize`Forecasts`
        },
      },
      {
        path: 'manage-inventory',
        loadChildren: () => import('./manage-inventory/manage-inventory.module').then((m) => m.ManageInventoryModule),
        component: ManageInventoryComponent,
        data: {
          title: $localize`Manage Inventories`
        },
      },
      {
        path: 'inventories',
        loadChildren: () => import('./inventories/inventories.module').then((m) => m.InventoriesModule),
        component: InventoriesComponent,
        data: {
          title: $localize`Inventories`
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
