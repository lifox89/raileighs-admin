import { AfterViewInit, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, Observable } from 'rxjs';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { MatSort, Sort} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';

@UntilDestroy()
@Component({
  selector: 'app-table-paginate',
  templateUrl: './table-paginate.component.html',
  styleUrls: ['./table-paginate.component.scss']
})
export class TablePaginateComponent implements OnInit, AfterViewInit {

  @ViewChild('paginatorOrder') orderpaginator: MatPaginator;
  @ViewChild('paginatorItems') itemPaginator: MatPaginator;
  @ViewChild('sortOrders') sortOrders = new MatSort();
  @ViewChild('sortItems') sortItems = new MatSort();
  @Input() storeId = '';
  @Input() storeName = '';

  public dataSource = new MatTableDataSource<any>([]);
  public itemSource = new MatTableDataSource<any>([]);
  public ordersRange : Observable<any[]>;
  public orderColumns: string[] = ['position', 'order_time', 'payment_type', 'payment_reference','order_total'];
  public itemColumns:  string[] = ['position', 'item_name', 'item_qty'];


  _show:boolean = false;

  constructor( private reportServ: ReportsService,
               private _liveAnnouncer: LiveAnnouncer) { 
    
  }

  ngAfterViewInit() {

    this.ordersRange = new Observable<any[]>;
    this.dataSource.data = [];
    this.itemSource.data = [];

    this.dataSource.paginator = this.orderpaginator;
    this.dataSource.sort = this.sortOrders;

    this.itemSource.paginator = this.itemPaginator;
    this.itemSource.sort = this.sortItems;
  } 
  
  
  ngOnInit(): void {
    this.ordersRange = this.reportServ.getSales_range();
    this.loadTable();
  }

  loadTable(){
    this.ordersRange.pipe(untilDestroyed(this),debounceTime(500))
                    .subscribe( stores => {
      
      if (stores) {

        this.reportServ.getOrdersItemsRange(this.storeId)
                       .pipe(untilDestroyed(this))
                       .subscribe( items => {
          if (items) {
            this.itemSource.data = items;
          }
        });

        let res = stores.find( found => {
          return (found.store_id === this.storeId);
        });

        if (res) {
          this._show = true;
          this.dataSource.data = res.orders;
        }
      }
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

 

}
