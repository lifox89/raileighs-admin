import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';
import { ReportsService } from './shared/services/reports.service';
import { AuthenticationService } from './shared/services/authentication.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'Raileighs Franchise Admin';

  constructor(
    private router: Router,
    private titleService: Title,
    private reportServ: ReportsService,
    private authServ: AuthenticationService,
    private iconSetService: IconSetService
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });

    this.initializeData();
  }

  initializeData(){
    this.authServ.isLoggedIn().then( (bol) => {
      if (bol) {
        this.reportServ.initDashboard();
      }
    });
  }

}
