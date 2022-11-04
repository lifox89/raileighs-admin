import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, Observable } from 'rxjs';
import { commissary } from 'src/app/shared/model/commissary';
import { CommissaryService } from "src/app/shared/services/commissary.service";
import { ReportsService } from 'src/app/shared/services/reports.service';

@UntilDestroy()
@Component({
  selector: 'app-inventories',
  templateUrl: './inventories.component.html',
  styleUrls: ['./inventories.component.scss']
})
export class InventoriesComponent implements OnInit {

  public ngForm: FormGroup;
  public viewForm: FormGroup;
  public visible:boolean = false;
  public viewBol:boolean = false;

  public commList : Observable<commissary[]>;
  public storeList: Observable<any[]>;

  constructor( private formBuilder: FormBuilder,
               private router: Router,
               private reportServ: ReportsService,
               private commServ: CommissaryService) { 
    
    this.commServ.fetchCommissary();
    this.commList = this.commServ.getComissary();
    this.storeList = this.reportServ.getStores();
  
  }

  ngOnInit(): void {
    
    this.ngForm = this.formBuilder.group({
      comm_name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      comm_address: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      manager_name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      contact_no: new FormControl('', Validators.compose([
        Validators.required
      ])),
      comm_stores: this.formBuilder.array([])
    });

    this.viewForm = this.formBuilder.group({
      comm_id: new FormControl(''),
      comm_name: new FormControl(''),
      comm_address: new FormControl(''),
      manager_name: new FormControl(''),
      contact_no: new FormControl(''),
      comm_stores: this.formBuilder.array([])
    });
  }

  private addStoresForm(){

    this.ngForm.reset();

    const ngForm = this.ngForm.get('comm_stores') as FormArray;

    while (ngForm.length) {
      ngForm.removeAt(0);
    }

    ngForm.reset();
    
    this.storeList.pipe(untilDestroyed(this))
        .subscribe(sub=>{if(sub){
          
          sub.forEach( store => {

            ngForm.push(new FormGroup({
              status :    new FormControl(false),
              store_id:   new FormControl(store.store_id),
              store_name: new FormControl(store.store_name),
            }));
          });
        }});
  }

  openModal(){
    this.visible = !this.visible;
    this.addStoresForm();
  }

  manageInventory(commId:string){
    this.viewBol = !this.viewBol;
    this.router.navigateByUrl('/home/components/manage-inventory',{ state: {id : commId} });
  }


  openView(comm:commissary){

    let vwForm = this.viewForm.get('comm_stores') as FormArray;
        
    while (vwForm.length) {
      vwForm.removeAt(0);
    }

    vwForm.reset();

    if (comm) {

      this.viewForm.patchValue({ 
        comm_id : comm.commissary_id,
        comm_name : comm.commissary_name,
        comm_address: comm.commissary_address,
        manager_name: comm.commissary_manager,
        contact_no: comm.contact_no,
      });

      this.storeList.pipe(untilDestroyed(this))
          .subscribe(sub=>{if(sub){
            
            // Loop through each store
            sub.forEach( store => { 

              // Check if store id exisit in comm store array
              if (!comm.commissary_stores) {
                comm.commissary_stores = [];
              }
              const found = comm.commissary_stores.find( storeId => { return (storeId === store.store_id) }); 

              vwForm.push(new FormGroup({
                status :    new FormControl(found? true : false),
                store_id:   new FormControl(store.store_id),
                store_name: new FormControl(store.store_name),
              }));
            });
          }});
    }

    this.viewBol = !this.viewBol;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  viewChange(event:any){
    this.viewBol = event;
  }

  addNew(value:any){

    this.commServ.addNewCommissary(value)
                 .then(()=>{
                  console.log('Created!');
                 })
                 .catch(()=>{
                  console.log('error!');
                 });

    this.visible = false;
  }

  update(value:any){
    this.commServ.updateCommissary(value)
                 .then(()=>{
                   console.log('Updated!');
                 })
                 .catch(()=>{
                   console.log('Error!');
                 });

    this.viewBol = !this.viewBol;
  }

  delComm(value : any){

    this.commServ.removeCommissary(value)
                 .then(()=>{
                   console.log('Updated!');
                 })
                 .catch(()=>{
                   console.log('Error!');
                 });

    this.viewBol = !this.viewBol;
  }


  
}
