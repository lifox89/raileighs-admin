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
         ButtonModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';



@NgModule({
  declarations: [ ManageInventoryComponent ],
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
  ]
})
export class ManageInventoryModule { }
