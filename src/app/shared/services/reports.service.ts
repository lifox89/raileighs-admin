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

        console.log(stores);
        this.franchiseStores.next(stores);
        this.franchiseOrders.next(orders);
    }
  }
}


// 