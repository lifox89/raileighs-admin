import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageInventoryComponent } from "./manage-inventory.component";
import { GridModule, 
         CardModule, 
         ModalModule, 
         FormModule , 
         BadgeModule,
         TableModule,
         TooltipModule,
         ToastModule,
         ButtonModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SortPipe } from "src/app/shared/pipes/sort.pipe";
import { MatRadioModule } from "@angular/material/radio";


@NgModule({
  declarations: [ ManageInventoryComponent, SortPipe ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    GridModule, 
    CardModule, 
    ModalModule, 
    FormModule , 
    ButtonModule,
    BadgeModule,
    TableModule,
    IconModule,
    TooltipModule,
    Ng2SearchPipeModule,
    MatRadioModule,
    ToastModule
  ],

  providers:[SortPipe]
})
export class ManageInventoryModule { }
