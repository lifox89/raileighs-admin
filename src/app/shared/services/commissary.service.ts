import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { commissary } from "src/app/shared/model/commissary";
import { user } from "src/app/shared/model/user";
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@Injectable({
  providedIn: 'root'
})
export class CommissaryService {

  private user: user;
  private commissary = new BehaviorSubject<commissary[]>(undefined);

  constructor( private firestore: AngularFirestore) { 
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  // GET SERVICES
  getComissary(){
    return this.commissary.asObservable();
  }

  // FETCH SERVICES
  fetchCommissary(){
    
    this.firestore.collection('servidor_commissary', ref => ref
                  .where("franchise_id","==", this.user.userId)
                  .where("inactive","==",false))
                  .snapshotChanges()
                  .subscribe( subs => {
                    let comms = [];

                    subs.forEach( sub => {
                      let data : any = sub.payload.doc.data();
                      data.commissary_id =sub.payload.doc.id;

                      comms.push(data);
                    });

                    this.commissary.next([]);
                    this.commissary.next(comms);

                  });

  }


  // ADD SERVICES
  async addNewCommissary( newCom: any): Promise<boolean>{

    let storeArr  = [];

    if (newCom.comm_stores) {
      newCom.comm_stores.forEach( store => {
        if (store.status) {
          storeArr.push(store.store_id);
        }
      }); 
    }

    let data: commissary = {
      commissary_name:    newCom.comm_name,
      commissary_address: newCom.comm_address,
      commissary_manager: newCom.manager_name,
      commissary_stores:  storeArr,
      contact_no:         newCom.contact_no,
      franchise_id:       this.user.userId,
      inactive: false,
    };

    console.log(data);
    return new Promise((resolve, reject)=> {

      this.firestore.collection('servidor_commissary').doc(data.commissary_name)
                    .set(data)
                    .then(()=>{
                      resolve(true);
                    })
                    .catch(()=>{
                      reject(false);
                    });
    });

  };

  async updateCommissary( newCom: any): Promise<boolean>{

    let storeArr  = [];

    if (newCom.comm_stores) {
      newCom.comm_stores.forEach( store => {
        if (store.status) {
          storeArr.push(store.store_id);
        }
      }); 
    }

    return new Promise((resolve, reject)=> {

      this.firestore.collection('servidor_commissary').doc(newCom.comm_id)
                    .update({commissary_stores: storeArr})
                    .then(()=>{
                      resolve(true);
                    })
                    .catch(()=>{
                      reject(false);
                    });
    });

  };

  // DELETE SERVICES
  async removeCommissary( comm:any){
    return new Promise((resolve, reject)=> {

      this.firestore.collection('servidor_commissary').doc(comm.comm_id)
                    .update({ inactive : true})
                    .then(()=>{
                      resolve(true);
                    })
                    .catch(()=>{
                      reject(false);
                    });
    });
  }

}
