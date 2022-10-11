import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from "src/app/shared/services/authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  signinForm: FormGroup;
  errorTitle: string;
  errorMessage: string;
  visible = false;

  constructor( private authServices: AuthenticationService,
               private formBuilder:  FormBuilder,
               private router: Router,
               private title: Title) {}


  ngOnInit(){
    this.title.setTitle('Sign In - Raileighs Admin');
    this.initForm();
  }

  signIn(){
    if (this.signinForm.valid) {
      this.authServices.signIn( this.signinForm.get('email').value , this.signinForm.get('password').value )
                       .then( result => {
                          console.log(result);
                       }).catch( error => {
                        this.onVisibleChange(true);
                       })
    }
  }

  private initForm(): void {
    this.signinForm = this.formBuilder.group({
      email: this.formBuilder.control('', Validators.required),
      password: this.formBuilder.control('', Validators.required)
    });
  }

  

  onVisibleChange(eventValue: boolean) {
    this.visible = eventValue;
  }

  onResetDismiss() {
    this.visible = false;
  }
} 
