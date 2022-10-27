import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgbCalendar, NgbInputDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { debounceTime, Observable } from 'rxjs';
import { ReportsService } from 'src/app/shared/services/reports.service';


@UntilDestroy()
@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {

  fromDate: any;
  targetDate: any;

  rangeText: string = 'Specific date';
  switchbol: boolean;

  _generated: boolean = false;
  _total: number = 0;
  _show:boolean = false;

  dataLength: any[] = [];

  franchiseStores: Observable<any[]>;
  franchiseExpenses: Observable<any[]>;

  constructor( public  config: NgbInputDatepickerConfig,
               private snackBar:    MatSnackBar,
               public  calendar:    NgbCalendar,
               public  reportServ: ReportsService) { 

    config.minDate = {year: 2020, month: 1, day: 1};
    config.maxDate = {year: 2099, month: 12, day: 31};
    config.outsideDays = 'hidden';
    config.autoClose = 'outside';

  }

  ngOnInit(): void {
    this.franchiseStores = this.reportServ.getStores();
    this.franchiseExpenses = this.reportServ.getExpensesRange();
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


  setTotal(event:any){
    this._total = 0;

    this.franchiseExpenses.pipe(untilDestroyed(this),debounceTime(500))
                          .subscribe( stores => {   
      if (stores && stores[event.index]) {
        this._total = stores[event.index].expense_today;
      }
    });
  }


  singleDate( date: any) {
    this.reportServ.fetchExpenses(null, date);
  }

  dateRange( fromDate: any, targetDate: any){

    if ( (fromDate && targetDate) && (fromDate < targetDate)) {

      this.reportServ.fetchExpenses(fromDate,targetDate);
      
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


  openSnackBar(message: string) {
    this.snackBar.open(message,null,{duration: 5000});
  }

}
