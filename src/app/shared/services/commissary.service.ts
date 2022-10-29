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
    
    this.firestore.collection('servidor_commissary', ref => ref.where("franchise_id","==", this.user.userId))
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

    let data: commissary = {
      commissary_name:    newCom.comm_name,
      commissary_address: newCom.comm_address,
      commissary_manager: newCom.manager_name,
      contact_no:         newCom.contact_no,
      franchise_id:       this.user.userId
    };

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

}
