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
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";


@NgModule({
  declarations: [ 
    ItemsSummaryComponent,
    OrdersSummaryComponent,
    ReportsComponent
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
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule
  ],
  exports: [
    ItemsSummaryComponent,
    OrdersSummaryComponent
  ]
})
export class ComponentsModule { }
