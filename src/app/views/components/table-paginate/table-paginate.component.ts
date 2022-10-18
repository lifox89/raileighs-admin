import { AfterViewInit, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, Observable } from 'rxjs';
import { ReportsService } from 'src/app/shared/services/reports.service';

@UntilDestroy()
@Component({
  selector: 'app-table-paginate',
  templateUrl: './table-paginate.component.html',
  styleUrls: ['./table-paginate.component.scss']
})
export class TablePaginateComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() storeId = '';

  public dataSource = new MatTableDataSource<any>([]);
  public ordersRange : Observable<any[]>;
  public displayedColumns: string[] = ['position', 'order_time', 'payment_type', 'payment_reference','order_total'];

  constructor( private reportServ: ReportsService,
               private ngZone: NgZone) { 
    
  }

  ngOnInit(): void {
    this.ordersRange = this.reportServ.getSales_range();
    this.loadTable();
  }

  loadTable(){
    this.ordersRange.pipe(untilDestroyed(this),debounceTime(500))
                    .subscribe( stores => {
      
      if (stores) {

        let res = stores.find( found => {
          return (found.store_id === this.storeId);
        });

        if (res) {
          this.dataSource.data = res.orders;
        }
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }  

}
