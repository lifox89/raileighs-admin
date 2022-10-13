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

  private startToday : any;
  private endToday: any;
  private user: user;
  private franchiseOrders = new BehaviorSubject<any[]>(undefined);
  private franchiseStores = new BehaviorSubject<any>(undefined);
  

  constructor( private firestore : AngularFirestore) { 

    const start : any = moment().startOf('day');
    const end   : any = moment().endOf('day');

    this.startToday = new Date(start).getTime();
    this.endToday   = new Date(end).getTime();
  }


  public getSales_today(){
    return this.franchiseOrders.asObservable();
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
          console.log(array);
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


  public fetchSales_today(){
    let orders : Array<any> = [];
    let stores: Array<any> = [];
    this.user = JSON.parse(localStorage.getItem('user'));

    if (this.user) {
      this.user.stores.forEach(store=>{
        
        this.firestore.collection('servidor-accounts').doc(store)
                      .get()
                      .subscribe( dat => {
                        let value : any = dat.data();

                        let store = {
                          store_id      : value.store_id,
                          store_name    : value.store_name,
                          store_currency: value.store_currency,
                          sales_date: this.startToday,
                        };
                        
                        if (!stores.find( found => {return (found.store_id == store)})) {
                          stores.push(store);
                        }
                      });

        this.firestore.collection('servidor-accounts').doc(store)
                      .collection('ordersArchive',ref => ref.orderBy('order_time')
                      .where("order_time",">=", this.startToday)
                      .where("order_time","<=", this.endToday))
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
        this.franchiseStores.next(stores);
        this.franchiseOrders.next(orders);
    }
  }
}


// 