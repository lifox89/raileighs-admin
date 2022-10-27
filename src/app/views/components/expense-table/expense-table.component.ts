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
  selector: 'app-expense-table',
  templateUrl: './expense-table.component.html',
  styleUrls: ['./expense-table.component.scss']
})
export class ExpenseTableComponent implements OnInit, AfterViewInit {

  @ViewChild('paginatorExpense') expensePaginator: MatPaginator;
  @ViewChild('sortExpense') sortExpense = new MatSort();

  @Input() storeId = '';
  @Input() storeName = '';

  _show:boolean = false;

  franchiseExpenses: Observable<any[]>;
  dataSource = new MatTableDataSource<any>([]);


  public orderColumns: string[] = ['position', 'expense_time', 'expense_type', 'other_desc','expense_amount'];

  constructor( private _liveAnnouncer: LiveAnnouncer, 
               private reportServ: ReportsService) { 

  } 

  ngOnInit(): void {
    this.franchiseExpenses = this.reportServ.getExpensesRange();
    this.loadTable();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.expensePaginator;
    this.dataSource.sort = this.sortExpense;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  loadTable(){

    this.franchiseExpenses.pipe(untilDestroyed(this),debounceTime(5000))
                          .subscribe( stores => {
      
      if (stores) {
        
        let res = stores.find( found => {
          return (found.store_id === this.storeId);
        });

        if (res) {
          this._show = true;
          this.dataSource.data = res.expenses;
        }
      }
    });
  }
}
