import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';
import { Location } from '@angular/common'
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-unit-certificate',
  templateUrl: './unit-certificate.component.html',
  styleUrls: ['./unit-certificate.component.css']
})
export class UnitCertificateComponent {
  public invoiceInfo: any
  public installmentAmount: number
  public Date: any
  public name: any
  Address: any
  index: any
  public jointInvestor: any = []
  company_trustName: any
  investor_no: any
  certificateNo: any
  className: string
  public share: number
  date: any
  formType:string
  pipe = new DatePipe('en-US');
  public prop_type:string
  public ARSN:string
  
  constructor(public _commonService: CommonService, public router: Router, private location: Location) {
    
    this.invoiceInfo = this._commonService.invoiceData
    this.investor_no = this.invoiceInfo[0].enq_client_data.client_id
    console.log(this.invoiceInfo)
    this.formType=this.invoiceInfo[0].enq_form_data.investor_form_type
    this.certificateNo = this.invoiceInfo[0].order_id
    this.className = this.invoiceInfo[0].enq_prop_data.property_name
    this.installmentAmount = this.invoiceInfo[0].investing_amount
    this.share = this.invoiceInfo[0].investment_unit
    this.date = this.invoiceInfo[0].createdAt
    this.index = this.invoiceInfo[0].enq_form_data.primary_index
    this.getUserDetail()
    if (this.invoiceInfo[0].enq_form_data.form_a.jointInvestor.length != 0 && this.invoiceInfo[0].enq_form_data.investor_form_type == "Individual") {
      this.jointInvestorName(this.invoiceInfo[0].enq_form_data.form_a.jointInvestor)
    }
    this.prop_type = this.invoiceInfo[0].enq_prop_data.prop_type == 3 ? "Wellkins Mortgage Fund " : "Wellkins Capital Fund"
    this.ARSN = this.invoiceInfo[0].enq_prop_data.prop_type == 3 ? '673 559 576' : '614 577 276'
  }
  public getUserDetail() {

     if (this.invoiceInfo[0].enq_form_data.investor_form_type == "Unregulated" || this.invoiceInfo[0].enq_form_data.investor_form_type == "Regulated" ) {
      this.name = ''

      this.Address= ''
      this.company_trustName = this.invoiceInfo[0].enq_form_data.form_c.trustname
    }   if (this.invoiceInfo[0].enq_form_data.investor_form_type == "Individual") {
      if (this.invoiceInfo[0].enq_form_data.form_a.ispersonalprimary == "Y") {
        this.name = this.invoiceInfo[0].enq_form_data.form_a.title + " " + this.invoiceInfo[0].enq_form_data.form_a.givennames + " " + (this.invoiceInfo[0].enq_form_data.form_a.middlename != null ? this.invoiceInfo[0].enq_form_data.form_a.middlename : '') + " " + this.invoiceInfo[0].enq_form_data.form_a.surname

        this.Address= this.invoiceInfo[0].enq_form_data.form_a.house + " " + this.invoiceInfo[0].enq_form_data.form_a.street + " " + this.invoiceInfo[0].enq_form_data.form_a.street_type + ", " + this.invoiceInfo[0].enq_form_data.form_a.suburb +' ' +this.invoiceInfo[0].enq_form_data.form_a.state + " " + this.invoiceInfo[0].enq_form_data.form_a.postcode
        this.company_trustName = ''
      } else {
        this.name = this.invoiceInfo[0].enq_form_data.form_a.jointInvestor[this.index].title + " " + this.invoiceInfo[0].enq_form_data.form_a.jointInvestor[this.index].givennames + " " + (this.invoiceInfo[0].enq_form_data.form_a.jointInvestor[this.index].middlename != null ? this.invoiceInfo[0].enq_form_data.form_a.jointInvestor[this.index].middlename : '') + " " + this.invoiceInfo[0].enq_form_data.form_a.jointInvestor[this.index].surname

        this.Address= this.invoiceInfo[0].enq_form_data.form_a.jointInvestor[this.index].house + " " + this.invoiceInfo[0].enq_form_data.form_a.jointInvestor[this.index].street + " " + this.invoiceInfo[0].enq_form_data.form_a.jointInvestor[this.index].street_type + ", " + this.invoiceInfo[0].enq_form_data.form_a.jointInvestor[this.index].suburb +'  ' +this.invoiceInfo[0].enq_form_data.form_a.jointInvestor[this.index].state + " " + this.invoiceInfo[0].enq_form_data.form_a.jointInvestor[this.index].postcode
        this.company_trustName = ''
      }
    }
    else if (this.invoiceInfo[0].enq_form_data.investor_form_type == "Company" || this.invoiceInfo[0].enq_form_data.investor_form_type == "Australian public company" ) {
      // this.name = this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].title + " " + this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].directornames + " " + (this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].middlename != null ? this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].middlename : '') + " " + this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].surname
        this.name = this.invoiceInfo[0].enq_form_data.form_h.companyname 
      this.Address = this.invoiceInfo[0].enq_form_data.form_h.house + " " + this.invoiceInfo[0].enq_form_data.form_h.street + " " + this.invoiceInfo[0].enq_form_data.form_h.street_type + ", " + this.invoiceInfo[0].enq_form_data.form_h.suburb +'  ' +this.invoiceInfo[0].enq_form_data.form_h.state + " " + this.invoiceInfo[0].enq_form_data.form_h.postcode
      this.company_trustName =''
    }
    else if ( this.invoiceInfo[0].enq_form_data.investor_form_type == "Unregulated Corporate" || this.invoiceInfo[0].enq_form_data.investor_form_type == "Regulated Corporate") {
      // this.name = this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].title + " " + this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].directornames + " " + (this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].middlename != null ? this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].middlename : '') + " " + this.invoiceInfo[0].enq_form_data.form_h.Director[this.index].surname
        this.name = this.invoiceInfo[0].enq_form_data.form_h.companyname + " Trustee For " + this.invoiceInfo[0].enq_form_data.form_c.trustname
      this.Address = ''
      this.company_trustName = ''
    }
  }
  public navigate() {
    this.location.back()
  }
  //genearate joint holder names 
  joint_investor: any
  public jointInvestorName(data) {
    this.jointInvestor = []
    this.jointInvestor.push(this.invoiceInfo[0].enq_form_data.form_a.title + " " + this.invoiceInfo[0].enq_form_data.form_a.givennames + " " + (this.invoiceInfo[0].enq_form_data.form_a.middlename != null ? this.invoiceInfo[0].enq_form_data.form_a.middlename : '') + " " + this.invoiceInfo[0].enq_form_data.form_a.surname)
    for (let i = 0; i < data.length; i++) {
      this.jointInvestor.push(data[i].title + " " + data[i].givennames + " " + (data[i].middlename != null ? data[i].middlename : '') + " " + data[i].surname)
      
    }
    this.joint_investor = JSON.stringify(this.jointInvestor)
   
 this.joint_investor =  this.joint_investor.replace(/[\[\]"]/g, "");
 const lastIndex =  this.joint_investor.lastIndexOf(',')
    const replacement = ' & ';

const replaced =
this.joint_investor.slice(0, lastIndex) +
  replacement +
  this.joint_investor.slice(lastIndex + 1);

  this.joint_investor = replaced
  this.joint_investor = this.joint_investor.replace(/,/g, ", ")
  }
}
