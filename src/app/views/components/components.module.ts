import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  CardModule,
  DropdownModule,
  GridModule,
  ProgressModule,
  SharedModule,
  WidgetModule
} from '@coreui/angular';


import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { WidgetsModule } from '../widgets/widgets.module';

import { ComponentsRoutingModule } from './components-routing.module';
import { TableModule, UtilitiesModule } from '@coreui/angular';

import { ItemsSummaryComponent } from "./items-summary/items-summary.component";
import { OrdersSummaryComponent } from "./orders-summary/orders-summary.component";

@NgModule({
  declarations: [ 
    ItemsSummaryComponent,
    OrdersSummaryComponent
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
    WidgetsModule
  ],
  exports: [
    ItemsSummaryComponent,
    OrdersSummaryComponent
  ]
})
export class ComponentsModule { }
