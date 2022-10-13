import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReportsService } from 'src/app/shared/services/reports.service';

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
    });
    
  }

}
