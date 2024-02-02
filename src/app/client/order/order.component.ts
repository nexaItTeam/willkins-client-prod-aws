import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/shared/common.service';
import { DatePipe } from '@angular/common';
import {
  SVGIcon,
  facebookIcon,
  pinterestIcon,
  twitterIcon,
  cancelIcon,
  shareIcon,
  eyeIcon,
  fontGrowIcon,
  formIcon,
  paddingIcon,
  groupBoxIcon,
  bookIcon,
  clipboardTextIcon,
} from "@progress/kendo-svg-icons";
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class OrderComponent implements OnInit {
  pipe = new DatePipe('en-US');
  public clientId: any
  public name: any
  public email: any
  public contactno: any
  public Address: any
  public index: any
  public propertyId: any
  public propertyImage: any
  public prop_name: string
  public prop_desc: string
  public property_performance: number
  words: any[];
  public originalValue: number
  //dataSource!: MatTableDataSource<any>;
  dataSource = new MatTableDataSource<any>;

  constructor(private spinner: NgxSpinnerService, public _commonService: CommonService, private router: Router,
    private route: ActivatedRoute, private currencyPipe: CurrencyPipe) {
    this.clientId = sessionStorage.getItem('id')


  }
  displayedColumns: string[] = [
    "id",
    "order_id",
    "investing_amount",
    "enq_form_data",
    "enq_prop_data",
    "prop_type",
    "paidStatus",
    "action"
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => this.words = params.getAll('words'));
    this.propertyId = this.words[0]
    this.prop_name = this.words[1]
    this.prop_desc = this.words[2]

    this.originalValue = this.words[4].replace(/[^a-zA-Z0-9 ]/g, '')
    this.property_performance = ((this.originalValue - +this.words[3]) / this.originalValue) * 100
    console.log(this.property_performance)
    this.getOrder()
    this.getPropertyImage()
  }
  public statusList = [{
    type: 'Under Review',
    value: 0
  },
  {
    type: 'Approved',
    value: 1
  },
  {
    type: 'First Installment Recieved',
    value: 2
  }, {
    type: 'Rejected',
    value: 3
  },
  {
    type: 'Payment Received ',
    value: 4
  }
  ]
  public getOrder() {
    this.spinner.show()
    var body = {
      "client_id": this.clientId,
      "prop_id": this.propertyId
    }
    this._commonService.getOrderData(body).subscribe({
      next: (res: any) => {

        this.dataSource = new MatTableDataSource(res.getOrder);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.spinner.hide();
        //  this.generateInvoiceonMail()
        this.dataSource.filterPredicate = (data: any, filter: any) => {
          return data.enq_form_data.investor_form_type.toLocaleLowerCase().includes(filter) ||
            data.enq_prop_data.property_name.toLocaleLowerCase().includes(filter) ||
            data.order_id?.toString().trim().toLowerCase().includes(filter) ||
            data.investing_amount.toString().trim().toLowerCase().includes(filter) ||
            data.id.toString().trim().toLowerCase().includes(filter);

        }

      },
      error: (err: any) => {
        alert('error from server side');
        this.spinner.hide();
      }
    });
  }
  /* applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  } */
  viewApplication(row) {

    this._commonService.orderData = []
    this._commonService.orderData.push(row)
    this.router.navigate(['client/print-application'])
  }
  viewInvoice(row) {

    this._commonService.invoiceData = []
    this._commonService.invoiceData.push(row)
    this.router.navigate(['invoice'])
  }
  viewCerticate(row) {
    this._commonService.invoiceData = []
    this._commonService.invoiceData.push(row)
    this.router.navigate(['certificate'])
  }
  applyFilter(event) {
    const filterValue = event.target.value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  generateInvoiceonMail() {
    console.log(this.dataSource.filteredData[0])
    if (!this.dataSource.filteredData[0].isEamil) {
      this.getUserDetail()
    } else {
      return
    }
  }

  public getUserDetail() {

    this.index = this.dataSource.filteredData[0].enq_form_data?.primary_index
    if (this.dataSource.filteredData[0].enq_form_data.investor_form_type != "Individual" && this.dataSource.filteredData[0].enq_form_data.investor_form_type != "Company" && this.dataSource.filteredData[0].enq_form_data.investor_form_type != "Australian public company") {
      this.name = this.dataSource.filteredData[0].enq_form_data.form_c.Trustee[this.index].title + " " + this.dataSource.filteredData[0].enq_form_data.form_c.Trustee[this.index].givennames + " " + this.dataSource.filteredData[0].enq_form_data.form_c.Trustee[this.index].surname
      this.email = this.dataSource.filteredData[0].enq_form_data.form_c.Trustee[this.index].email
      this.contactno = this.dataSource.filteredData[0].enq_form_data.form_c.Trustee[this.index].phone
      this.Address = this.dataSource.filteredData[0].enq_form_data.form_c.Trustee[this.index].house + " " + this.dataSource.filteredData[0].enq_form_data.form_c.Trustee[this.index].street + " " + this.dataSource.filteredData[0].enq_form_data.form_c.Trustee[this.index].street_type + "," + this.dataSource.filteredData[0].enq_form_data.form_c.Trustee[this.index].suburb + ' ' + this.dataSource.filteredData[0].enq_form_data.form_c.Trustee[this.index].postcode
    } else if (this.dataSource.filteredData[0].enq_form_data.investor_form_type == "Individual") {
      if (this.dataSource.filteredData[0].enq_form_data.form_a.ispersonalprimary == "Y") {
        this.name = this.dataSource.filteredData[0].enq_form_data.form_a.title + " " + this.dataSource.filteredData[0].enq_form_data.form_a.givennames + " " + this.dataSource.filteredData[0].enq_form_data.form_a.surname
        this.email = this.dataSource.filteredData[0].enq_form_data.form_a.email
        this.contactno = this.dataSource.filteredData[0].enq_form_data.form_a.phone
        this.Address = this.dataSource.filteredData[0].enq_form_data.form_a.house + " " + this.dataSource.filteredData[0].enq_form_data.form_a.street + " " + this.dataSource.filteredData[0].enq_form_data.form_a.street_type + "," + this.dataSource.filteredData[0].enq_form_data.form_a.suburb + ' ' + this.dataSource.filteredData[0].enq_form_data.form_a.postcode
      } else {
        this.name = this.dataSource.filteredData[0].enq_form_data.form_a.jointInvestor[this.index].title + " " + this.dataSource.filteredData[0].enq_form_data.form_a.jointInvestor[this.index].givennames + " " + this.dataSource.filteredData[0].enq_form_data.form_a.jointInvestor[this.index].surname
        this.email = this.dataSource.filteredData[0].enq_form_data.form_a.jointInvestor[this.index].email
        this.contactno = this.dataSource.filteredData[0].enq_form_data.form_a.jointInvestor[this.index].phone
        this.Address = this.dataSource.filteredData[0].enq_form_data.form_a.jointInvestor[this.index].house + " " + this.dataSource.filteredData[0].enq_form_data.form_a.jointInvestor[this.index].street + " " + this.dataSource.filteredData[0].enq_form_data.form_a.jointInvestor[this.index].street_type + "," + this.dataSource.filteredData[0].enq_form_data.form_a.jointInvestor[this.index].suburb + ' ' + this.dataSource.filteredData[0].enq_form_data.form_a.jointInvestor[this.index].postcode
      }
    }
    else if (this.dataSource.filteredData[0].enq_form_data.investor_form_type == "Company" || this.dataSource.filteredData[0].enq_form_data.investor_form_type == "Australian public company") {
      this.name = this.dataSource.filteredData[0].enq_form_data.form_h.Director[this.index].title + " " + this.dataSource.filteredData[0].enq_form_data.form_h.Director[this.index].directornames + " " + this.dataSource.filteredData[0].enq_form_data.form_h.Director[this.index].surname
      this.email = this.dataSource.filteredData[0].enq_form_data.form_h.Director[this.index].email
      this.contactno = this.dataSource.filteredData[0].enq_form_data.form_h.Director[this.index].phone
      this.Address = this.dataSource.filteredData[0].enq_form_data.form_h.house + " " + this.dataSource.filteredData[0].enq_form_data.form_h.street + " " + this.dataSource.filteredData[0].enq_form_data.form_h.street_type + "," + this.dataSource.filteredData[0].enq_form_data.form_h.suburb + ' ' + this.dataSource.filteredData[0].enq_form_data.form_h.postcode
    }
    var mailobj = {
      email: {
        name: this.name,
        email: this.email,
        contactno: this.contactno,
        address: this.Address,
        refno: this.dataSource.filteredData[0].order_id,
        price_per_share: this.currencyPipe.transform(this.dataSource.filteredData[0].enq_prop_data.price_per_share),
        units: this.dataSource.filteredData[0].investing_amount / this.dataSource.filteredData[0].enq_prop_data.price_per_share,
        Monies_Due: this.currencyPipe.transform(this.dataSource.filteredData[0].investing_amount),
        immediate_payment: this.currencyPipe.transform(this.dataSource.filteredData[0].enq_prop_data?.first_installment_price * this.dataSource.filteredData[0].investing_amount / this.dataSource.filteredData[0].enq_prop_data.price_per_share),
        next_installment: this.currencyPipe.transform(this.dataSource.filteredData[0].investing_amount - (this.dataSource.filteredData[0].enq_prop_data?.first_installment_price * this.dataSource.filteredData[0].investing_amount / this.dataSource.filteredData[0].enq_prop_data.price_per_share)),
        id: this.dataSource.filteredData[0].id,
        date: this.pipe.transform(this.dataSource.filteredData[0].createdAt, 'MM/dd/yyyy'),
        prop_name: this.dataSource.filteredData[0].enq_prop_data.property_name

      }
    }
    this._commonService.sendEmailInvoice(mailobj).subscribe({
      next: (res: any) => {



      },


      error: (err: any) => {
        alert('error from server side');
        this.spinner.hide();
      }
    });
  }
  viewTransaction(rowData) {
    this._commonService.invoiceData = []
    this._commonService.invoiceData.push(rowData)
    this.router.navigate(['transaction'])
  }
  //get property image
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
  public socialItems: Array<any> = [
    { svgIcon: clipboardTextIcon, label: "Preview Transactions" },
    { svgIcon: bookIcon, label: "View Application" },
    { svgIcon: clipboardTextIcon, label: "View & Download TERMS OF PAYMENT" },
    { svgIcon: bookIcon, label: "View & Download Unit Certificate" },
  ];
  onfullnameClick(dataItem, row) {
    switch (dataItem.item.label) {
      case 'Preview Transactions':
        this.viewTransaction(row)
        break;
      case 'View Application':
        this.viewApplication(row)
        break;
      case 'View & Download TERMS OF PAYMENT':
        this.viewInvoice(row)
        break;
      case 'View & Download Unit Certificate':
        if ( row.paidStatus == 4) {
          this.viewCerticate(row)
        } else {
          alert('Unit Certificate can be downloaded after installment are paid')
        }
        break;
    }
  }

  public get svgIcon(): SVGIcon {
    return this.dialOpen ? cancelIcon : eyeIcon;
  }

  public onDialOpen(): void {
    this.dialOpen = true;
  }

  public onDialClose(): void {
    this.dialOpen = false;
  }
  public dialOpen = false;
  public navigate() {
    this.router.navigate(['client/view-investment'])
  }
}
