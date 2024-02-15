import { Component, OnInit } from '@angular/core';
import { CommonService } from '../shared/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-app-signature',
  templateUrl: './app-signature.component.html',
  styleUrls: ['./app-signature.component.css']
})
export class AppSignatureComponent implements OnInit {
  socket: WebSocket;
  signedform!: FormGroup;
  signaturename:string
  name:string
id:number
constructor(
  public _commonService: CommonService,
  public spinner:NgxSpinnerService,
  private _fb: FormBuilder,
  private route: ActivatedRoute
){

  const ws = new WebSocket('ws://localhost:4200/app-identification');

  // Assuming 'scannedData' contains the data from the QR code
  const scannedData = 'Data from QR code';
  
  // Send the scanned data to the WebSocket server
  ws.addEventListener('open', function(event) {
    ws.send(scannedData);
  });
  this.route.queryParams.subscribe(params => {
    this.name = params['name'];
   this.id = params['uid'];

    console.log('Name:', this.name);
    console.log('ID:', this.id);
  });
}
ngOnInit(): void {
  this.signedform = this._fb.group({
    
    sid:[null,Validators.required]
  })
}

onupload(){
  this.spinner.show()
 
  var body={
    "signiture": {
        "signiture":this.id+this.name,
        "digital_sign":{
            "buffer":this.signedform.value
        }

    }
}
this._commonService.senddigitalsignature(body).subscribe((res:any)=>{
  if(res){
    this.spinner.hide()
    
    
    alert("Signature uploaded ");
    
   
  }
},(error: any) => {
  this.spinner.hide()
  alert("Something went wrong")
})
}
}
