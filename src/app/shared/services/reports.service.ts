import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { user } from "src/app/shared/model/user";
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private user: user;
  private franchiseOrders       = new BehaviorSubject<any[]>(undefined);
  private franchiseStores       = new BehaviorSubject<any>(undefined);
  private franchiseOrdersRange  = new BehaviorSubject<any[]>(undefined);
  
  constructor( private firestore : AngularFirestore) { 

  }

  // GET METHODS
  public getSales_today(){
    return this.franchiseOrders.asObservable();
  }

  public getSales_range(){
    return this.franchiseOrdersRange.asObservable();
  }

  public getStores(){
    return this.franchiseStores.asObservable();
  }

  public getOrdersStore(storeId:string){

    let orders = new BehaviorSubject<any[]>(undefined);
    let array = [];

    if (this.franchiseOrders.value) {

      this.franchiseOrders.value.find( found => {

        if (found.store_id == storeId) {
          array = found.orders;
          orders.next(array);
        }
      });

    }
    return orders.asObservable();
  }


  public getOrdersItems(storeId:string){

    let items = new BehaviorSubject<any[]>(undefined);
    let array = [];

    if (this.franchiseOrders.value) {
      this.franchiseOrders.value.find( found => {

        if (found.store_id == storeId) {
          found.orders.forEach( order => {
            order.order_items.forEach( item => {

              let result = array.find( dat => {
                return (dat.item_added === item.item_added)
              });

              if (!result) {
                array.push({
                  item_added: item.item_added,
                  item_name:  item.item_name,
                  item_qty:   item.item_qty,
                });
              }else{
                result.item_qty += item.item_qty;
              }

            });
          });

          items.next(array);
        }
      });
    }
    return items.asObservable();
  }



  // FETCH METHODS
  public fetchStores(){
    let stores: Array<any> = [];

    this.user = JSON.parse(localStorage.getItem('user'));

    if (this.user && !this.franchiseStores.value) {
      
      this.user.stores.forEach(store=> {

        this.firestore.collection('servidor-accounts').doc(store)
                      .get()
                      .subscribe( dat => {
                        let value : any = dat.data();

                        let store = {
                          store_id      : value.store_id,
                          store_name    : value.store_name,
                          store_currency: value.store_currency,
                        };
                        
                        if (!stores.find( found => {return (found.store_id == store)})) {
                          stores.push(store);
                        }
                      });
      });

      this.franchiseStores.next(stores);
    }
  }


  public fetchSales_today( date: any){
    let orders : Array<any> = [];
    let start = this.startofDay(date);
    let end   = this.endofDay(date);

    if (date) {
      this.franchiseOrdersRange.next(null);
    }

    this.user = JSON.parse(localStorage.getItem('user'));

    if (this.user) {
      this.user.stores.forEach(store=>{

        this.firestore.collection('servidor-accounts').doc(store)
                      .collection('ordersArchive',ref => ref.orderBy('order_time')
                      .where("order_time",">=", start)
                      .where("order_time","<=", end))
                      .get().subscribe( data => {

                        let temp = {
                          store_id : store,
                          sales_today: 0,
                          orders: [],
                        };

                        data.forEach(dat => {
                          let order:any = dat.data();
                          temp.sales_today += order.order_total;
                          temp.orders.push(dat.data());
                        });

                        if (!orders.find( found => {
                          return (found.store_id == temp.store_id)})) {
                            orders.push(temp);
                        }
                      });
        });

        if (date) {
          this.franchiseOrdersRange.next(orders);
        }else{
          this.franchiseOrders.next(orders);
        }
        
    }
  }


  // UTILITIES
  startofDay(date:any){

    let start: any;

    if (date) {
      start = moment(date).startOf('day');
    }else{
      start = moment().startOf('day');
    }
  
    return (new Date(start).getTime());
  }

  endofDay(date:any){

    let end:any;

    if (date) {
      end = moment(date).endOf('day');
    }else{
      end = moment().endOf('day');
    }

    return (new Date(end).getTime());
  }
}


// 