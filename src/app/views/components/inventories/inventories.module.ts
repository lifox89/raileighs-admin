import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoriesComponent } from "./inventories.component";
import { GridModule, CardModule, ModalModule, FormModule , ButtonModule } from '@coreui/angular';
import { CdkAccordionModule} from '@angular/cdk/accordion';

@NgModule({
  declarations: [ InventoriesComponent ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    GridModule,
    CardModule,
    ModalModule,
    FormModule,
    ButtonModule,
    CdkAccordionModule
  ]
})

export class InventoriesModule { }
