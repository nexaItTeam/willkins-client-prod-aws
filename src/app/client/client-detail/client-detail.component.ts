import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent {
  showDeleteBtn: boolean = false;
  fileName: any
  client_number: string | number
  public clientData:any
  clientimageurl:string | ArrayBuffer
  enquiryForm!: FormGroup
  url: any = '';
  public clientimageData: any
  constructor(private _commonService: CommonService, public spinner: NgxSpinnerService, private _fb: FormBuilder,) {
    this.client_number = sessionStorage.getItem('client_id')
    this.getClientDetails()
    this.enquiryForm = this._fb.group({
      "full_name": ['', Validators.required],
      "client_email": [''],
      "contact_no": [''],
     


    });
  }
  onSelectFile(event) {
if(event.target.files[0].type == 'image/png' || event.target.files[0].type == 'image/jpeg'){
    if (event.target.files && event.target.files[0]) {
      this.showDeleteBtn =true
      this.clientimageData = event.target.files[0]
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.clientimageurl = event.target.result;
       
      };
    }

  }
  else{
    alert('Only .png,.jpeg format are supported')
  }
  }

  uploadindividualoption_2() {

   
    const uploadItems: any = new FormData();
    uploadItems.append('id', this.client_number);
    uploadItems.append('document', this.clientimageData);
    uploadItems.append("docs_type", 'client_image');
    var reader = new FileReader();

    console.log(this.clientimageData)
    const result = this._commonService
      .uploadClientattachments(uploadItems)
      .subscribe({
        next: (val: any) => {


        },
        error: (err: any) => {
          alert("something went wrong during upload Image")
          // this.spinner.hide()
        },
      });

  }
  public delete() {
    this.showDeleteBtn = false
    this.clientimageData = null
    if(this.clientData.client_image != null){
      this.clientimageurl ='https://wellkinsstorageprod.blob.core.windows.net/document/'+this.client_number+this.clientData.client_image;
    }else{
     this.clientimageurl ='https://www.w3schools.com/howto/img_avatar.png'
    }
  }
  async onFormSubmit() {
    this.spinner.show()
    if (this.clientimageData) {
      await this.uploadindividualoption_2()
    }
    if (this.enquiryForm.valid) {

      var body = {
        "client": {
          "id": sessionStorage.getItem('id'),
          "full_name": this.enquiryForm.controls['full_name'].value,
          "client_image":this.clientimageData.name,
        }
      }
      this._commonService
        .updateEnquiryList(body)
        .subscribe({
          next: (val: any) => {
            alert(' Details Updated!');
            this.spinner.hide()

          },
          error: (err: any) => {
            alert('error from server side ')
            this.spinner.hide()
          },
        });

    } else {
      alert("Please fill the form correctly")
      this.spinner.hide()
    }



  }
  //get client info by passing id on load
  getClientDetails() {
    this.spinner.show()
    var body = {
      
        "id": sessionStorage.getItem('id'),
        "client_email": sessionStorage.getItem('client_email'),
     
    }
    this._commonService
      .getClientData(body)
      .subscribe({
        next: (val: any) => {
         
          this.spinner.hide()
         this.enquiryForm.patchValue(val.getClient)
         this.clientData = val.getClient
         if(val.getClient.client_image != null){
         this.clientimageurl ='https://wellkinsstorageprod.blob.core.windows.net/document/'+this.client_number+val.getClient.client_image;
         }else{
          this.clientimageurl ='https://www.w3schools.com/howto/img_avatar.png'
         }
        },
        error: (err: any) => {
          alert('error from server side ')
          this.spinner.hide()
        },
      });

  }

}
