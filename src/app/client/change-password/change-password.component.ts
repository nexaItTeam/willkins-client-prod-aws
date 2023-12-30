import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  loginForm!: FormGroup;
  public showPassword: boolean = false;
  public showoldPassword: boolean = false;
  public shownewPassword: boolean = false;

  constructor( private _fb: FormBuilder,private _commonService: CommonService,
    private router:Router,private http: HttpClient,
    public spinner:NgxSpinnerService) {
      }
  ngOnInit(): void {
    this.loginForm = this._fb.group({
      username: [null],
      password: [null],
      confirmpassword:[null],
      confirmpasswordduplicate:[null]
    })
  }
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  public toggleoldPasswordVisibility(): void {
    this.showoldPassword = !this.showoldPassword;
  }
  public togglenewPasswordVisibility(): void {
    this.shownewPassword = !this.shownewPassword;
  }
  onSubmit(){
    this.spinner.show()
 
  var body={
    "client": {
        "email": sessionStorage.getItem('client_email'),
        "old_password":this.loginForm.get('password').value ,
        "new_password":this.loginForm.get('confirmpassword').value
    }
}
this._commonService.updateclientpass(body).subscribe((res:any)=>{
  if(res){
    this.spinner.hide()
    
    
    alert("Password Changed Sucessfully");
    this.router.navigate(['client/dashboard'])
   
  }
},(error: any) => {
  this.spinner.hide()
  alert("Something went wrong")
})
  }
}
