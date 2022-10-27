import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { collections } from "src/app/shared/constants/enum";
import {UntilDestroy, untilDestroyed}  from '@ngneat/until-destroy';
import { ReportsService } from './reports.service';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userData:any;
  authState: Observable<any>;

  constructor(private afStore: AngularFirestore,
              private ngFireAuth: AngularFireAuth,
              private reportServ: ReportsService,
              public router: Router,
              public ngZone: NgZone) { 

    // this.ngFireAuth.authState.subscribe((user) => {
    //   if (user) {
    //     this.userData = user;
    //     localStorage.setItem('user', JSON.stringify(this.userData));
    //     JSON.parse(localStorage.getItem('user'));
    //   } else {
    //     localStorage.setItem('user', null);
    //     JSON.parse(localStorage.getItem('user'));
    //   }
    // });

  }

  async signIn(email: string, password: string){

    return new Promise<any>((resolve,reject) => {
      
      this.ngFireAuth.signInWithEmailAndPassword(email, password)
                     .catch(error => {reject(error);})
                     .then( cred => {
        if (cred) {
  
          this.afStore.collection('servidor_franchise').doc(cred.user.uid).get().subscribe( franchise => {
            if (franchise) {
              const user: any = franchise.data();

              this.userData = {
                'userId'    : cred.user.uid,
                'userEmail' : cred.user.email,
                'userName'  : user.franchise_company_name,
                'stores'    : user.franchise_stores
              };

              localStorage.setItem('user', JSON.stringify(this.userData));
              this.reportServ.initDashboard();
              this.router.navigateByUrl('/home/dashboard');
              resolve(true);
            }
          });
        }
      });  
    })
  }

  async isLoggedIn() : Promise<boolean>{
    return await new Promise((resolve)=>{
      this.ngFireAuth.onAuthStateChanged((creds)=>{
        if (creds) {
          resolve(true);
        }else{
          resolve(false);
        }
      })
    });
  }

  logOut(){
    
    this.ngFireAuth.signOut().then((data)=>{
      localStorage.removeItem('user');
      this.router.navigateByUrl('/login');
    }).catch((reason)=> {
      console.log(reason);
    })

  }

  errorHanlder(){

  }
}
