import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { user } from "src/app/shared/model/user";
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { order_type } from "src/app/shared/constants/enum";

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private user: user;

  private franchiseOrders        = new BehaviorSubject<any[]>(undefined);
  private franchiseStores        = new BehaviorSubject<any[]>(undefined);

  private franchiseOrdersRange   = new BehaviorSubject<any[]>(undefined);
  private franchiseExpensesRange = new BehaviorSubject<any[]>(undefined);

  private _spinnerState          = new BehaviorSubject<boolean>(undefined);

  constructor( private firestore : AngularFirestore) { 

  }

  // Initialize Dashboard
  initDashboard(){
    this.fetchStores();
    this.fetchSales_today(null);
  }


  //
  public initRange(){
    this.franchiseOrdersRange.next([]);
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

  public getOrdersItemsRange(storeId:string, orderType: string){

    let items = new BehaviorSubject<any[]>(undefined);
    let array = [];

    if (this.franchiseOrdersRange.value) {

      this.franchiseOrdersRange.value.find( found => {

        if (found.store_id == storeId) {

          found.orders.filter(elem=>elem.order_type == (orderType != order_type.PANDA ? order_type.DINE_IN : order_type.PANDA))
                      .forEach( order => {

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

  public getExpensesRange(){
    return this.franchiseExpensesRange.asObservable();
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

  public fetchExpenses( from: any, target: any){

    let expenses : Array<any> = [];
    let start: any;
    let end: any;

    if (from) { // If not null, range date is requested
      start = this.startofDay(from);
      end   = this.endofDay(target);
    }else{ // For single day request
      start = this.startofDay(target);
      end   = this.endofDay(target);

    }

    if (target) {
      this.franchiseExpensesRange.next([]);
    }

    this.user = JSON.parse(localStorage.getItem('user'));

    if (this.user) {
      this.user.stores.forEach(store=>{

        this.firestore.collection('servidor-accounts').doc(store)
                      .collection('storeExpenses',ref => ref.orderBy('expense_time')
                      .where("expense_time",">=", start)
                      .where("expense_time","<=", end))
                      .get().pipe(untilDestroyed(this))
                      .subscribe( data => {

                        if (data) {

                          let temp = {
                            store_id : store,
                            expense_today: 0,
                            expenses: [],
                          };
  
                          data.forEach(dat => {
                            let item:any = dat.data();
                            temp.expense_today += item.expense_amount;
                            temp.expenses.push(dat.data());
                          });
  
                          if (!expenses.find( found => {
                            return (found.store_id == temp.store_id)})) {
                              expenses.push(temp);
                          }
                        }
                        
                      });
        });

        this.franchiseExpensesRange.next(expenses);
        
    }
  }

  public fetchSales_today( date: any){
    let orders : Array<any> = [];
    let start = this.startofDay(date);
    let end   = this.endofDay(date);

    if (date) {
      this.franchiseOrdersRange.next([]);
    }

    this.user = JSON.parse(localStorage.getItem('user'));

    if (this.user) {
      this.user.stores.forEach(store=>{

        this.firestore.collection('servidor-accounts').doc(store)
                      .collection('ordersArchive',ref => ref.orderBy('order_time')
                      .where("order_time",">=", start)
                      .where("order_time","<=", end))
                      .get().pipe(untilDestroyed(this))
                      .subscribe( data => {

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


  public fetchSales_range( fromDate: any, targetDate: any){
    let orders : Array<any> = [];
    
    let start = this.startofDay(fromDate);
    let end   = this.endofDay(targetDate);

    this.franchiseOrdersRange.next([]);

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

        this.franchiseOrdersRange.next(orders);
        
    }
  }


  // UTILITIES

  setSpinnerState(state:boolean){
    this._spinnerState.next(state);
  }

  getSpinnerState(){
    return this._spinnerState.asObservable();
  }

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