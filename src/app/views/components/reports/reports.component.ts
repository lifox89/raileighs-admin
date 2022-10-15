import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {NgbCalendar, NgbDateStruct, NgbInputDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import * as moment from 'moment';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  fromDate: any;
  targetDate: any;

  rangeText: string = 'Specific date';
  switchbol: boolean;

  _generated: boolean = true;
  _total: number = 0;

  ordersRange : Observable<any[]>;
  franchiseStores: Observable<any[]>;

  displayedColumns: string[] = ['position', 'order_time', 'payment_type', 'payment_reference','order_total'];

  constructor(  private reportServ:  ReportsService,
                public  config:      NgbInputDatepickerConfig, 
                public  calendar:    NgbCalendar ) {
    

    this.reportServ.fetchStores();
    this.franchiseStores = this.reportServ.getStores();
                  
    config.minDate = {year: 2020, month: 1, day: 1};
    config.maxDate = {year: 2099, month: 12, day: 31};
    config.outsideDays = 'hidden';
    config.autoClose = 'outside';

  }


  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

  setTotal(event:any){
    if (this.ordersRange) {
       this.ordersRange.subscribe( stores => {
        this._total = stores[event.index].sales_today;
      })
    }
  }

  ngOnInit(): void {
    
  }

  toggleSwitch(){
    this.switchbol = !this.switchbol;

    if (this.switchbol) {
      this.rangeText = 'Date range';
    }else{
      this.rangeText = 'Single date'
    }
  }

  generateReport(){
    this._generated = true;

    if (!this.switchbol) {
      this.singleDate(this.targetDate);
    }else{

    }
  }

  checkIndex(idx:any){
    let res : boolean = false;

    if (idx == 0) {
      res = true;
    }

    return res;
  }

  singleDate( date: any) {
    this.reportServ.fetchSales_today(this.targetDate);
    this.ordersRange = this.reportServ.getSales_range();
  }

  onDateSelect(date){
    let str = String(date.year) + String(date.month) + String(date.day);
    this.targetDate = new Date(moment(str,'YYYYMMDD').toDate()).getTime();
  }

  getData(storeId:any){
    let data = new MatTableDataSource<any>();

    if (this.ordersRange) {
      
      this.ordersRange.subscribe( stores => {
        let res = stores.find( found => {
          return (found.store_id == storeId);
        });

        if (res) {
          data = res.orders;
          data.paginator = this.paginator;
        }
      });
    }
    return data;
  }

  
}
