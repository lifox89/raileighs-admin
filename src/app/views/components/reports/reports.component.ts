import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {NgbCalendar, NgbInputDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { debounceTime, Observable, Subscription } from 'rxjs';
import { MatSnackBar} from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  

  fromDate: any;
  targetDate: any;

  rangeText: string = 'Specific date';
  switchbol: boolean;

  _generated: boolean = false;
  _total: number = 0;

  dataLength: any[] = [];

  ordersRange : Observable<any[]>;
  franchiseStores: Observable<any[]>;

  constructor(  private reportServ:  ReportsService,
                private snackBar:    MatSnackBar,
                public  config:      NgbInputDatepickerConfig, 
                public  calendar:    NgbCalendar ) {
    
    this.reportServ.fetchStores();
    this.ordersRange = this.reportServ.getSales_range();

    config.minDate = {year: 2020, month: 1, day: 1};
    config.maxDate = {year: 2099, month: 12, day: 31};
    config.outsideDays = 'hidden';
    config.autoClose = 'outside';

  }


  openSnackBar(message: string) {
    this.snackBar.open(message,null,{duration: 5000});
  }

  setTotal(event:any){
    this.ordersRange.pipe(untilDestroyed(this),debounceTime(500))
                    .subscribe( stores => {   
      if (stores && stores[event.index]) {
        this._total = stores[event.index].sales_today;
      }
    });
  }

  ngOnInit(): void {
    this.reportServ.initRange();
    this.franchiseStores = this.reportServ.getStores();
  }

  toggleSwitch(){
    this.switchbol = !this.switchbol;
    this.targetDate = this.fromDate ='';

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
      this.dateRange(this.fromDate, this.targetDate);
    }

    this.setTotal({index:0}); // Trigger Total
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
  }

  dateRange( fromDate: any, targetDate: any){

    if ( (fromDate && targetDate) && (fromDate < targetDate)) {
      this.reportServ.fetchSales_range(fromDate,targetDate);
      
    }else{
      this.openSnackBar('Invalid date range, please fill up correctly!');
    }

    
  }

  onDateSelectTarget(date:any){
    let str = String(date.year) + String(date.month) + String(date.day);
    this.targetDate = new Date(moment(str,'YYYYMMDD').toDate()).getTime();
  }

  onDateSelectFrom(date:any){
    let str = String(date.year) + String(date.month) + String(date.day);
    this.fromDate = new Date(moment(str,'YYYYMMDD').toDate()).getTime();
  }

 
}