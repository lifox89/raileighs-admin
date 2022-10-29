import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { commissary } from 'src/app/shared/model/commissary';
import { CommissaryService } from "src/app/shared/services/commissary.service";

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

  constructor( private formBuilder: FormBuilder,
               private commServ: CommissaryService) { 
    
    this.commServ.fetchCommissary();
    this.commList = this.commServ.getComissary();
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
    });

    this.viewForm = this.formBuilder.group({
      comm_name: new FormControl(''),
      comm_address: new FormControl(''),
      manager_name: new FormControl(''),
      contact_no: new FormControl(''),
    });
  }

  openModal(){
    this.visible = !this.visible;
  }

  openView(comm:commissary){
    
    this.viewBol = !this.viewBol;

    if (comm) {
      this.viewForm.patchValue({ 
          comm_name : comm.commissary_name,
          comm_address: comm.commissary_address,
          manager_name: comm.commissary_manager,
          contact_no: comm.contact_no
      });
    }
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


  
}
