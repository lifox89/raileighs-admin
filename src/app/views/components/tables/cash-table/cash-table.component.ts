import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, Observable } from 'rxjs';
import { ReportsService } from 'src/app/shared/services/reports.service';

@UntilDestroy()
@Component({
  selector: 'app-cash-table',
  templateUrl: './cash-table.component.html',
  styleUrls: ['./cash-table.component.scss']
})
export class CashTableComponent implements OnInit {

  @ViewChild('paginatorExpense') expensePaginator: MatPaginator;
  @ViewChild('sortCash') sortCash = new MatSort();

  @Input() storeId = '';
  @Input() storeName = '';

  _show:boolean = false;

  franchiseSales: Observable<any[]>;
  dataSource = new MatTableDataSource<any>([]);


  public cashColumns: string[] = ['transaction_time','transaction_type','transaction_receiver',
                                   'transaction_amount','total_cashsales','total_expenses','total_gcashbank'];
  
  constructor( private _liveAnnouncer: LiveAnnouncer, 
               private reportServ: ReportsService) { 

  } 

  ngOnInit(): void {
    this.franchiseSales = this.reportServ.getCashRange();
    this.loadTable();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.expensePaginator;
    this.dataSource.sort = this.sortCash;
  }

  getClass(type){
    return type == 'credit' ? 'transaction-credit' : 'transaction-debit';
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  loadTable(){

    this.franchiseSales.pipe(untilDestroyed(this),debounceTime(5000))
                          .subscribe( stores => {
      
      if (stores) {
        console.log(stores);
        let res = stores.find( found => {
          return (found.store_id === this.storeId);
        });

        if (res) {
          this._show = true;
          this.dataSource.data = res.cash_history;
          console.log(res);
        }
      }
    });
  }

}
