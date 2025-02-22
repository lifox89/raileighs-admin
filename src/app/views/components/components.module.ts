import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  CardModule,
  DropdownModule,
  GridModule,
  ProgressModule,
  SharedModule,
  WidgetModule,
  NavModule, 
  TabsModule,
  UtilitiesModule,
  TableModule,
  FormModule,  
  TooltipModule,
} from '@coreui/angular';

import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { WidgetsModule } from '../widgets/widgets.module';


import { ComponentsRoutingModule } from './components-routing.module';
import { NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';

import { ItemsSummaryComponent } from "./items-summary/items-summary.component";
import { OrdersSummaryComponent } from "./orders-summary/orders-summary.component";
import { ReportsComponent } from './reports/reports.component';


import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableExporterModule } from 'mat-table-exporter';
import { ModalModule, BadgeModule } from '@coreui/angular';


import { TablePaginateComponent } from './tables/table-paginate/table-paginate.component';
import { ExpenseTableComponent } from './tables/expense-table/expense-table.component';
import { CashTableComponent } from "./tables/cash-table/cash-table.component";
import { ChartsComponent } from './charts/charts.component';
import { ForecastsComponent } from './forecasts/forecasts.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { CashComponent } from './cash/cash.component';



@NgModule({
  declarations: [ 
    ItemsSummaryComponent,
    OrdersSummaryComponent,
    ReportsComponent,
    TablePaginateComponent,
    ChartsComponent,
    ForecastsComponent,
    ExpensesComponent,
    ExpenseTableComponent,
    CashComponent,
    CashTableComponent,
   ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,

    TableModule, 
    UtilitiesModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    GridModule,
    ProgressModule,
    SharedModule,
    WidgetModule,
    IconModule,
    ChartjsModule,
    WidgetsModule,
    NavModule, 
    TabsModule,
    NgbDatepickerModule,
    FormModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatSnackBarModule,
    MatTableExporterModule,
    TooltipModule,

    ModalModule,
    BadgeModule
  ],
  exports: [
    ItemsSummaryComponent,
    OrdersSummaryComponent
  ],

  
})
export class ComponentsModule { }
