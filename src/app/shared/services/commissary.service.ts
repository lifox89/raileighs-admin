import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayUnion, increment } from '@angular/fire/firestore'

import { commissary, item } from "src/app/shared/model/commissary";
import { user } from "src/app/shared/model/user";
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';


@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class CommissaryService {

  private user: user;
  private commissary = new BehaviorSubject<commissary[]>(undefined);
  private storeRequest = new BehaviorSubject<any[]>(undefined);

  constructor( private firestore: AngularFirestore) { 
    this.user = JSON.parse(localStorage.getItem('user'));
    this.storeRequest.next([]);
  }

  // GET SERVICES
  getComissary(){
    return this.commissary.asObservable();
  }

  getRequestData(){
    return this.storeRequest.asObservable();
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

  fetchItemData(itemId:string, commId:string){

    let itemData = new BehaviorSubject<any>(undefined);

    this.firestore.collection('servidor_commissary').doc(commId)
                  .collection('items_inventory').doc(itemId)
                  .snapshotChanges()
                  .subscribe(sub=> {

                    // itemData.next([]);

                    if (sub) {

                      let temp:any = sub.payload.data();

                      temp.item_id = sub.payload.id;

                      const item = {
                        item_data : temp,
                        item_log : []
                      };

                      this.firestore.collection('servidor_commissary').doc(commId)
                                    .collection('items_inventory').doc(itemId)
                                    .collection('item_history', ref => ref
                                    .orderBy("transaction_time","desc")
                                    .limitToLast(10))
                                    .snapshotChanges()
                                    .subscribe(log => {
                                      if (log) {
                                        let array = [];
                                        
                                        log.forEach( elem => {

                                          let data : any = elem.payload.doc.data();
                                          data.log_id = elem.payload.doc.id;

                                          array.push(data);
                                        });

                                        item.item_log = array;
                                        itemData.next(item);
                                      }
                                    });

                      
                    }
                  });

    return itemData.asObservable();
  }

  // ADD SERVICES
  resetCart(){
    this.storeRequest.next([]);
  }

  async sendStoreRequest(comm:any){

    const value : any  = this.storeRequest.value;

    return new Promise((resolve,reject)=>{

      const data = {
        request_time : new Date().getTime(),
        request_status: 'PENDING',
        items: value,
      };

      this.firestore.collection('servidor_commissary').doc(value[0].commissary_id)
                    .collection('store_requests').doc(comm.store)
                    .collection('request_items').add(data)
                    .then(()=>{
                      this.resetCart();
                      resolve(true);
                    })
                    .catch((er)=>{
                      console.log(er);
                      reject(false);
                    })
    });

    
  }


  addtoCart( reqData:any){

    const currentValue = this.storeRequest.value;

    let ret = currentValue.find( elem => {
      if (elem.item_log_id === reqData.item_log_id) {
        elem.item_del_qty += reqData.item_del_qty;
      }
      return (elem.item_log_id === reqData.item_log_id);
    });

    let upd = [];

    if (ret) {
      upd = currentValue;
    }else{
      upd = [...currentValue, reqData];
    }

    this.storeRequest.next(upd);
  }


  async addYield(dat:any, commId:string){
    return new Promise((resolve,reject)=> {
      this.firestore.collection('servidor_commissary').doc(commId)
                    .collection('items_inventory').doc(dat.item_id)
                    .update({item_qty: increment(dat.item_qty)})
                    .then(()=>{
                      
                      const history = {
                        destination : commId,
                        item_qty : dat.item_qty,
                        item_unit : dat.item_unit,
                        transaction_time: new Date().getTime(),
                        transaction_type: 'credit',
                        item_del_qty: 0,
                      };

                      this.firestore.collection('servidor_commissary').doc(commId)
                                    .collection('items_inventory').doc(dat.item_id)
                                    .collection('item_history').add(history)
                                    .then(()=>{
                                      resolve(true);
                                    })
                                    .catch(()=>{
                                      reject(false);
                                    });
                    })
                    .catch(()=>{
                      reject(false);
                    })
    });
  }



  async addNewItemCommissary( item: any, commId: string){

    const data : item= {
      item_name: item.item_name,
      item_added: new Date().getTime(),
      item_qty: item.item_qty,
      item_unit: item.item_unit,
      inactive: false,
    }

    return new Promise((resolve,reject)=>{
      this.firestore.collection('servidor_commissary').doc(commId)
                    .collection('items_inventory').add(data)
                    .then((res)=>{

                      const itemList = {
                        item_id : res.id,
                        item_name : item.item_name,
                      };

                      this.firestore.collection('servidor_commissary').doc(commId)
                                    .update({ items_list : arrayUnion(itemList) })
                                    .then(()=>{
                                      
                                      const history = {
                                        destination : commId,
                                        item_qty : item.item_qty,
                                        item_unit : item.item_unit,
                                        transaction_time: new Date().getTime(),
                                        transaction_type: 'credit',
                                        item_del_qty: 0,
                                      };

                                      this.firestore.collection('servidor_commissary').doc(commId)
                                                    .collection('items_inventory').doc(res.id)
                                                    .collection('item_history').add(history)
                                                    .then(()=>{
                                                      resolve(true);
                                                    })
                                                    .catch(()=>{
                                                      reject(false);
                                                    })

                                    })
                                    .catch(()=>{
                                      reject(false);
                                    });
                    })
                    .catch(()=>{
                      reject(false);
                    });
    });
  }

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
      items_list: []
    };

    console.log(data);
    return new Promise((resolve, reject)=> {

      this.firestore.collection('servidor_commissary').doc(data.commissary_name)
                    .set(data)
                    .then(()=>{
                      
                      storeArr.forEach(elem => {
                        this.firestore.collection('servidor_commissary').doc(data.commissary_name)
                                      .collection('store_requests').doc(elem).set({});
                      });

                      
                      this.firestore.collection('servidor_commissary').doc(data.commissary_name)
                                    .collection('items_inventory').add({});

                      this.firestore.collection('servidor_commissary').doc(data.commissary_name)
                                    .collection('menu_components').add({});

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

                      storeArr.forEach(elem=>{
                        this.firestore.collection('servidor_commissary').doc(newCom.comm_id)
                                      .collection('store_requests').doc(elem)
                                      .snapshotChanges()
                                      .subscribe(sub=>{
                                          if ( sub && !sub.payload.exists) {
                                            this.firestore.collection('servidor_commissary').doc(newCom.comm_id)
                                                          .collection('store_requests').doc(elem).set({});
                                          }
                                      });
                      });


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
