import { Component, Input, OnInit } from '@angular/core';
import { units } from "src/app/shared/constants/enum";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommissaryService } from 'src/app/shared/services/commissary.service';
import { ActivatedRoute, Router } from '@angular/router';
import { commissary } from 'src/app/shared/model/commissary';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-manage-inventory',
  templateUrl: './manage-inventory.component.html',
  styleUrls: ['./manage-inventory.component.scss']
})
export class ManageInventoryComponent implements OnInit {
  
  _createView : boolean = true;
  _units = [];
  _commId:string; 

  _itemList: any[];
  _itemLog : any[];
  _addQty:number;
  _currItemId:string;

  ngForm : FormGroup;

  constructor( private formBuilder: FormBuilder,
               private router:      Router,
               private commServ:    CommissaryService ) { 
    this._units = units;
                

    if (this.router.getCurrentNavigation().extras.state) {
      const state : any= this.router.getCurrentNavigation().extras.state;
      this._commId = state.id;

      this.commServ.getComissary().pipe(untilDestroyed(this))
                   .subscribe(sub=> {
                    
                    if (sub) {
                      const dat = sub.find( comm => { return (comm.commissary_id === this._commId)});
                      this._itemList = dat.items_list;
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
  }

  back(){
    this.router.navigateByUrl('/home/components/inventories');
  }

  toggleCreate(){
    this._createView = true;
    this.ngForm.reset();
  }

  addYield(){

    let formData = this.ngForm.value;

    const data = {
      item_qty : this._addQty,
      item_id:   this._currItemId,
      item_unit: formData.item_unit
    }

    this.commServ.addYield(data,this._commId);
    this._addQty = 0;
  }

  addNew(value:any){
    this.ngForm.reset();
    this.commServ.addNewItemCommissary(value, this._commId).then(()=>{
      console.log('added!');
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
                    this._itemLog = data.item_log;
                  }
                 });
  }
}
