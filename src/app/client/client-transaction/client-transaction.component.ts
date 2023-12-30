import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/shared/common.service';
import { Location } from '@angular/common'
@Component({
  selector: 'app-client-transaction',
  templateUrl: './client-transaction.component.html',
  styleUrls: ['./client-transaction.component.css']
})
export class ClientTransactionComponent {
  public transactionData: any
  public propertyData: any
  propertyImage: any
  orderId:number
  constructor(public _commonService: CommonService, private spinner: NgxSpinnerService,
    private router: Router,private location:Location) {
    console.log(this._commonService.invoiceData)
    this.propertyData = this._commonService.invoiceData[0].enq_prop_data
    this.orderId = this._commonService.invoiceData[0].order_id
  }
  ngOnInit(): void {
    this.getTransaction()
   // this.getPropertyImage()
  }
  public getTransaction() {
    this.spinner.show()
    const body = {
      "client_id": sessionStorage.getItem('id'),
      "order_id":this.orderId,
      "holder_type":"self",
      "form_type":this._commonService.invoiceData[0].enq_form_data.investor_form_type
    }
    this._commonService.getTransactionData(body).subscribe({
      next: (res: any) => {

        this.transactionData = res.get_transaction[0]
        this.spinner.hide()
      },


      error: (err: any) => {
        alert('error from server side');
        this.spinner.hide();
      }
    });
  }
  //get propert image data
  public getPropertyImage() {
    let body = {
      "prop_id": null
    }
    var result = this._commonService
      .getPropertyImage(body)
      .subscribe({
        next: (val: any) => {
          this.propertyImage = val.data
        },
        error: (err: any) => {
          alert('Something went wrong!');
        },
      });

  }
  //navigate to order
  public navigate(){
  this.location.back()
  }
}
