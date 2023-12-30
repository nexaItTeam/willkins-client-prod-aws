import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../shared/common.service';
import { RoleService } from '../shared/role.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  public showPassword: boolean = false;
constructor( private _fb: FormBuilder,private _commonService: CommonService,private _roleService:RoleService,
  private router:Router,private http: HttpClient,public _authService:AuthService,
  public spinner:NgxSpinnerService) {
    }

ngOnInit(): void {
  this.loginForm = this._fb.group({
    username: [null],
    password: [null],
    checkform:['']
  });
}
public togglePasswordVisibility(): void {
  this.showPassword = !this.showPassword;
}
/* onSubmit(){
  if (this.loginForm.valid) {
    var body =
      {
        "login": {
            "client_email": this.loginForm.controls['username'].value,
            "password": this.loginForm.controls['password'].value
        }
    }
    
     this._commonService
    .loginUser(body)
    .subscribe({
      next: (val: any) => {
        alert('Logged in Sucessfull !');
        sessionStorage.setItem("isLoggedIn", JSON.stringify(true));
        this._roleService.currentUserValue.next(true)
       this._roleService.setRoleValue(val.user.user_type)
       this._roleService.getDisplayName(val.user.full_name)
       this._roleService.setAcessToken(val.accessToken)
       this._roleService.isloggedin= true;
    
       this.router.navigate(['']);
      // this.spinner.hide();
      },
      error: (err: any) => {
        if(err.error.error){
          alert(err.error.error)
        //  this.spinner.hide();
        }else if(err.error.message){
          alert(err.error.message)
        //  this.spinner.hide();
        }else{
          alert("error from server side")
        //  this.spinner.hide();
        }
      },
    }); 
  
  }
} */
async onSubmit(){
  this.spinner.show()
  var body =
      {
        "login": {
            "client_email": this.loginForm.controls['username'].value,
            "password": this.loginForm.controls['password'].value
        }
    }
    
 var res=  await this._authService.login(body)
  if(res){
   
  }
  }
  onForgotPass(){
    this.router.navigate(['forgot'])
  }
}
