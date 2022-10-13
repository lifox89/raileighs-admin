import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ReportsService } from 'src/app/shared/services/reports.service';

@Component({
  selector: 'app-orders-summary',
  templateUrl: './orders-summary.component.html',
  styleUrls: ['./orders-summary.component.scss']
})
export class OrdersSummaryComponent implements OnInit {


  _id:string;

  orders: Observable<any[]>;

  constructor(private route: ActivatedRoute,
              private reportServ: ReportsService) { 

  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this._id = params['id'];
      this.orders = this.reportServ.getOrdersStore(this._id);
    });
  }

}
