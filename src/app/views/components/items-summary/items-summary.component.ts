import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReportsService } from 'src/app/shared/services/reports.service';

@UntilDestroy()
@Component({
  selector: 'app-items-summary',
  templateUrl: './items-summary.component.html',
  styleUrls: ['./items-summary.component.scss']
})
export class ItemsSummaryComponent implements OnInit {

  orderItems : Observable<any[]>;
  
  _id : string;
  _view : string;

  constructor( private route: ActivatedRoute,
               private router: Router,
               private reportServ: ReportsService) { 
    
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this._id = params['id'];
      this.orderItems = this.reportServ.getOrdersItems(this._id);

      this.orderItems.pipe(untilDestroyed(this))
                     .subscribe( items => {
                       if (items) {
                         items.sort((a,b)=> b.item_qty - a.item_qty);
                       }
                     });
    });

    
    
  }

}
