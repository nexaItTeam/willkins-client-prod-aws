import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from '../shared/common.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxOtpInputConfig } from 'ngx-otp-input';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit{
  loginForm!: FormGroup;
  enableVerify:boolean =true
  public sessionId:number
  public showForgot:boolean =true
  public showVerification:boolean =false
  editPassword:boolean =false
  public key:string
  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true,
    classList: {
      inputBox: "my-super-box-class",
      input: "my-super-class",
      inputFilled: "my-super-filled-class",
      inputDisabled: "my-super-disable-class",
      inputSuccess: "my-super-success-class",
      inputError: "my-super-error-class"
    }
  }; 
constructor( private _fb: FormBuilder,private _commonService: CommonService,
  private router:Router,private http: HttpClient,
  public spinner:NgxSpinnerService) {
    }
ngOnInit(): void {
  this.loginForm = this._fb.group({
    username: [null],
    password: [null],
    confirmpassword:[null],
  })
}

onSubmit(){}
sendOtp(){
  this.spinner.show()
  var body={
    "email":this.loginForm.get('username').value
}
this._commonService.sendOtp(body).subscribe((res:any)=>{
  if(res){
    this.spinner.hide()
    this.sessionId=res.id
    this.showForgot =false
    this.showVerification=true
    alert(res.message)
  }
},(error: any) => {
this.spinner.hide()
  alert("Something went wrong")
})
}

onVerificationClick(){
  
  this.spinner.show()
  var body={
    "id": this.sessionId,
    "otp": this.key
}
this._commonService.verifyOtp(body).subscribe((res:any)=>{
  if(res){
    this.spinner.hide()
    if(res.message !="OTP is not match"){
    this.showForgot =false
    this.showVerification=false
    
      this.editPassword =true
    }
   
    alert(res.message)
  }
},(error: any) => {
  this.spinner.hide()
  alert("Something went wrong")
})
}



onpasswordChange(){
  this.spinner.show()
 
  var body={
    "client": {
        "email":this.loginForm.get('username').value,
        "password":this.loginForm.get('confirmpassword').value,
    }
}
this._commonService.changepass(body).subscribe((res:any)=>{
  if(res){
    this.spinner.hide()
    
    this.showForgot =false
    this.showVerification=false
    alert(res.message)
    this.router.navigate(['login'])
  }
},(error: any) => {
  this.spinner.hide()
  alert("Something went wrong")
})
 
}

handeOtpChange(value: string[]): void {
  this.enableVerify = true
  
}

handleFillEvent(value: string): void {
  this.enableVerify = false
 this.key=value
}

}
