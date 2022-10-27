import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './shared/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {

  constructor( private authServ: AuthenticationService,
               private router:   Router){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return (this.checkState());
  }

  async checkState() : Promise<boolean>{

    let state: boolean = false;
    
    await this.authServ.isLoggedIn().then((bol)=>{
      state = bol ? true: false;

      if (!state) {
        this.router.navigateByUrl('/login');
      }
    });

    return state;
  }
  
}
