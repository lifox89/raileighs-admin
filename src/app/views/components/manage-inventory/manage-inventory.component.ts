import { Component, ViewChild, OnInit } from '@angular/core';
import { EventTypes, units } from "src/app/shared/constants/enum";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommissaryService } from 'src/app/shared/services/commissary.service';
import { Router } from '@angular/router';
import { UntypedFormBuilder } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { UtilToastComponent } from "src/app/views/utilities/util-toast/util-toast.component";
import { Observable } from 'rxjs';
import { ReportsService } from 'src/app/shared/services/reports.service';

@UntilDestroy()
@Component({
  selector: 'app-manage-inventory',
  templateUrl: './manage-inventory.component.html',
  styleUrls: ['./manage-inventory.component.scss']
})
export class ManageInventoryComponent implements OnInit {

  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  placement = ToasterPlacement.TopCenter;

  _createView : boolean = true;
  _units = [];
  _commId:string; 

  _itemList: any[];
  _itemLog : any[];
  _addQty:number;
  _currItemId:string;
  _searchText:string;
  
  _addCart:number;
  _logId:string = '';
  _itemId:string;
  _logItem:any;

  _cartItems: Observable<any[]>;
  _stores: Observable<any[]>;

  ngForm : FormGroup;


  btnRadioGroup = this.formBuilder.group({
    store: this.utBuilder.control('',Validators.compose([Validators.required]))
  });


  constructor( private formBuilder: FormBuilder,
               private router:      Router,
               private utBuilder:   UntypedFormBuilder,
               private reportServ:  ReportsService,
               private commServ:    CommissaryService ) { 
    this._units = units;
                

    if (this.router.getCurrentNavigation().extras.state) {
      const state : any= this.router.getCurrentNavigation().extras.state;
      this._commId = state.id;

      this.commServ.getComissary().pipe(untilDestroyed(this))
                   .subscribe(sub=> {
                    
                    if (sub) {
                      const dat = sub.find( comm => { return (comm.commissary_id === this._commId)});

                      if (dat && dat.items_list) {
                        this._itemList = dat.items_list;
                      }
                    }

                   });
    }
  }

  ngOnInit(): void {

    this.ngForm = this.formBuilder.group({
      item_name:  new FormControl('', Validators.compose([Validators.required])),
      item_qty:   new FormControl('', Validators.compose([Validators.required])),
      item_unit:  new FormControl('', Validators.compose([Validators.required])),
    });

    if (!this._commId) {
      this.back();
    }

    this.commServ.resetCart();
    this._cartItems = this.commServ.getRequestData();
    this._stores = this.reportServ.getStores();

    this._cartItems.pipe(untilDestroyed(this))
        .subscribe(sub=>{
          if (sub) {
            sub.forEach( item => {
              this._itemLog.find((elem)=>{
                if (elem.log_id == item.item_log_id) {
                  elem.item_del_qty = item.item_del_qty;
                }
            });
        });
      }
    });


  }

  setRadioValue(value: string): void {
    this.btnRadioGroup.setValue({ store : value });
  }

  addToast(title:string, message:string) {
    const options = {
      title: title,
      message: message,
      delay: 5000,
      placement: this.placement,
      autohide: true,
    }
    const componentRef = this.toaster.addToast(UtilToastComponent, { ...options });
  }

  back(){
    this.router.navigateByUrl('/home/components/inventories');
  }

  toggleCreate(){
    this._createView = true;
    this.ngForm.reset();
  }

  addCart(){


    let dat = this.ngForm.value;

    const reqData = {
      commissary_id: this._commId,
      item_log_id : this._logId,
      item_id: this._itemId,
      item_name: dat.item_name,
      item_del_qty: this._addCart,
      item_unit: dat.item_unit,
      production_date: this._logItem.transaction_time,
    };

    this.commServ.addtoCart(reqData);
    
    this._logId = '';
    this._addCart = null;
    this._logItem = null;

    this.addToast(EventTypes.SUCCESS,'Item added to request cart, actual deduction will be final upon sending request.');
    console.log(this._cartItems);
  }

  setItem(item:any){
    this._logItem = item;
  }

  addYield(){

    let formData = this.ngForm.value;

    const data = {
      item_qty : this._addQty,
      item_id:   this._currItemId,
      item_unit: formData.item_unit
    }

    this.commServ.addYield(data,this._commId).then(()=>{
      this.addToast(EventTypes.SUCCESS,'Yield added to item');
    });
    this._addQty = 0;
  }

  addNew(value:any){
    this.ngForm.reset();
    this.commServ.addNewItemCommissary(value, this._commId).then(()=>{
      this.addToast(EventTypes.SUCCESS,'New item added to commissary');
    })
  }

  getClass(type:string){
    return type == 'credit' ? 'log-credit' : 'log-debit';
  }

  openItem(item:any){

    this._currItemId = item.item_id;
    this._createView = false;
    this.commServ.fetchItemData(item.item_id, this._commId).pipe(untilDestroyed(this))
        .subscribe( data => {
        if (data) {
          this.ngForm.controls['item_name'].patchValue(data.item_data.item_name);
          this.ngForm.controls['item_qty'].patchValue(data.item_data.item_qty);
          this.ngForm.controls['item_unit'].patchValue(data.item_data.item_unit);
          this._itemId = data.item_data.item_id;
          this._itemLog = data.item_log;
        }
    });
  }
}
