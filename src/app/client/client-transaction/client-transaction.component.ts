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
  orderId: number
  invoiceInfo: any
  public jointInvestor: any = []
  joint_investor: any
  public name: any
  public company_trustName: any
  public index:any
  formType:string
  ARSN:number | string
  prop_type:number | string
  public date = new Date()
  showIndividualInvestname :boolean = true
  constructor(public _commonService: CommonService, private spinner: NgxSpinnerService,
    private router: Router, private location: Location) {

    this.invoiceInfo = this._commonService.invoiceData
    this.index = this.invoiceInfo[0].enq_form_data.primary_index
    this.formType=this.invoiceInfo[0].enq_form_data.investor_form_type
    this.prop_type = this.invoiceInfo[0].enq_prop_data.prop_type == 3 ? "Wellkins Mortgage Fund " : "Wellkins Capital Fund"
    this.ARSN = this.invoiceInfo[0].enq_prop_data.prop_type == 3 ? '673 559 576' : '614 577 276'
    this.propertyData = this._commonService.invoiceData[0].enq_prop_data
    this.orderId = this._commonService.invoiceData[0].order_id
  }
  ngOnInit(): void {
    this.getTransaction()
    // this.getPropertyImage()
    this.getUserDetail()
    if (this.invoiceInfo[0].enq_form_data.form_a.jointInvestor.length != 0 && this.invoiceInfo[0].enq_form_data.investor_form_type == "Individual") {
      this.showIndividualInvestname = false
      this.jointInvestorName(this.invoiceInfo[0].enq_form_data.form_a.jointInvestor)
    }
  }
  public getTransaction() {
    this.spinner.show()
    const body = {
      "client_id": sessionStorage.getItem('id'),
      "order_id": this.orderId,
      "holder_type": "self",
      "form_type": this._commonService.invoiceData[0].enq_form_data.investor_form_type
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
  //get name and propert info according to conditions
  public getUserDetail() {

    if (this.invoiceInfo[0].enq_form_data.investor_form_type == "Unregulated" || this.invoiceInfo[0].enq_form_data.investor_form_type == "Regulated") {
      this.name = ''
      this.company_trustName = this.invoiceInfo[0].enq_form_data.form_c.trustname
    } if (this.invoiceInfo[0].enq_form_data.investor_form_type == "Individual") {
      if (this.invoiceInfo[0].enq_form_data.form_a.ispersonalprimary == "Y") {
        this.name = this.invoiceInfo[0].enq_form_data.form_a.title + " " + this.invoiceInfo[0].enq_form_data.form_a.givennames + " " + (this.invoiceInfo[0].enq_form_data.form_a.middlename != null ? this.invoiceInfo[0].enq_form_data.form_a.middlename : '') + " " + this.invoiceInfo[0].enq_form_data.form_a.surname

        this.company_trustName = ''
      } else {
        this.name = this.invoiceInfo[0].enq_form_data.form_a.jointInvestor[this.index].title + " " + this.invoiceInfo[0].enq_form_data.form_a.jointInvestor[this.index].givennames + " " + (this.invoiceInfo[0].enq_form_data.form_a.jointInvestor[this.index].middlename != null ? this.invoiceInfo[0].enq_form_data.form_a.jointInvestor[this.index].middlename : '') + " " + this.invoiceInfo[0].enq_form_data.form_a.jointInvestor[this.index].surname
        this.company_trustName = ''
      }
    }
    else if (this.invoiceInfo[0].enq_form_data.investor_form_type == "Company" || this.invoiceInfo[0].enq_form_data.investor_form_type == "Australian public company") {
      // this.name = this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].title + " " + this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].directornames + " " + (this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].middlename != null ? this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].middlename : '') + " " + this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].surname
      this.name = this.invoiceInfo[0].enq_form_data.form_h.companyname
      this.company_trustName = ''
    }
    else if (this.invoiceInfo[0].enq_form_data.investor_form_type == "Unregulated Corporate" || this.invoiceInfo[0].enq_form_data.investor_form_type == "Regulated Corporate") {
      // this.name = this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].title + " " + this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].directornames + " " + (this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].middlename != null ? this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].middlename : '') + " " + this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].surname
      this.name = this.invoiceInfo[0].enq_form_data.form_h.companyname + " Trustee For " + this.invoiceInfo[0].enq_form_data.form_c.trustname
      this.company_trustName = ''
    }
  }
  //joint holder name
  public jointInvestorName(data) {
    this.jointInvestor = []
    this.jointInvestor.push(this.invoiceInfo[0].enq_form_data.form_a.title + " " + this.invoiceInfo[0].enq_form_data.form_a.givennames + " " + (this.invoiceInfo[0].enq_form_data.form_a.middlename != null ? this.invoiceInfo[0].enq_form_data.form_a.middlename : '') + " " + this.invoiceInfo[0].enq_form_data.form_a.surname)
    for (let i = 0; i < data.length; i++) {
      this.jointInvestor.push(data[i].title + " " + data[i].givennames + " " + (data[i].middlename != null ? data[i].middlename : '') + " " + data[i].surname)

    }
    this.joint_investor = JSON.stringify(this.jointInvestor)

    this.joint_investor = this.joint_investor.replace(/[\[\]"]/g, "");
    const lastIndex = this.joint_investor.lastIndexOf(',')
    const replacement = ' & ';

    const replaced =
      this.joint_investor.slice(0, lastIndex) +
      replacement +
      this.joint_investor.slice(lastIndex + 1);

    this.joint_investor = replaced
    this.joint_investor = this.joint_investor.replace(/,/g, ", ")
  }
  //navigate to order
  public navigate() {
    this.location.back()
  }
}
