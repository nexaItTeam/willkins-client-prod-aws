import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-buy-project',
  templateUrl: './buy-project.component.html',
  styleUrls: ['./buy-project.component.css']
})
export class BuyProjectComponent implements OnInit {
  buyForm!: FormGroup;
  propertyData: any;
  propertyImage: any;
  public userType: string;
  public viewPdf: boolean = false;
  public ViewFSG: boolean = false;
  public ViewTDM: boolean = false;
  public ViewPDS: boolean = false;
  public ViewSPDs: boolean = false;
  public isDownload: any;

  constructor(
    public dialogRef: MatDialogRef<BuyProjectComponent>,
    public spinner: NgxSpinnerService,
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public route: Router,
    public _commonService: CommonService,
    private router: ActivatedRoute
  ) {
    this.propertyData = data;
    this.isDownload = sessionStorage.getItem('isFirst');
    this.getPropertyImage();
    const getUserType = this.router.children[0].data;

    getUserType.subscribe(translatedValue => {
      this.userType = translatedValue.type;
    });
  }

  ngOnInit(): void {
    this.buyForm = this._fb.group({
      "InvestmentAmount": [null,Validators.required],
      "InvestmentType": [""],
      "consent": [''],
      "share": ['', Validators.required]
    });
  }

  gotoForm(value) {
    this.buyForm.get('InvestmentAmount').setValue(this.buyForm.get('share').value * this.propertyData.price_per_share);
    if ((this.viewPdf && this.ViewFSG && this.ViewPDS && this.ViewSPDs && this.ViewTDM) || this.isDownload) {
      this._commonService.orderData = [];
      this._commonService.propertyData = [];
      this._commonService.propertyData.push(this.buyForm.value, this.propertyData);
      this.route.navigate(['client/client-form']);
      this.dialogRef.close();
      this.updatePdfStatus();
    } else {
      alert("Please Download & View all 5 Pdf to proceed");
    }
  }

  public getPropertyImage() {
    let body = {
      "prop_id": null
    };

    this._commonService.getPropertyImage(body).subscribe({
      next: (val: any) => {
        this.propertyImage = val.data;
      },
      error: (err: any) => {
        alert('Something went wrong!');
      }
    });
  }

  checkPdf(pdfType) {
    switch (pdfType) {
      case 'FSG':
        this.ViewFSG = true;
        break;
      case 'TDM':
        this.ViewTDM = true;
        break;
      case 'Brochure':
        this.viewPdf = true;
        break;
      case 'PDS':
        this.ViewPDS = true;
        break;
      case 'SPDs':
        this.ViewSPDs = true;
        break;
    }
  }

  public updatePdfStatus() {
    let body = {
      "client": {
        "id": 13,
        "isFirst": true
      }
    };
    this._commonService.updateDocList(body).subscribe({
      next: (val: any) => {},
      error: (err: any) => {
        console.error(err);
        this.spinner.hide();
      }
    });
  }

  sendEnquiry(value) {
    this.spinner.show();
    this.buyForm.get('InvestmentAmount').setValue(this.buyForm.get('share').value * this.propertyData.price_per_share);

    var body = {
      "enquery": {
        "full_name": sessionStorage.getItem('client_name'),
        "user_email": sessionStorage.getItem('client_email'),
        "contact_no": sessionStorage.getItem('contact'),
        "location": null,
        "description": null,
        "property_id": this.propertyData.id,
        "invest": this.buyForm.get('InvestmentAmount').value,
        "property_name": this.propertyData.property_name
      }
    };

    this._commonService.addEnquiry(body).subscribe({
      next: (val: any) => {
        alert('Enquiry details Sent!');
        this.spinner.hide();
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        alert('Something went wrong');
        this.spinner.hide();
      }
    });
  }

  onsendEmailClick() {}

  calculateShare() {
    const investmentAmount = parseFloat(this.buyForm.get('InvestmentAmount').value.replace(/,/g, ''));
    const pricePerShare = this.propertyData.price_per_share;

    if (!isNaN(investmentAmount)) {
      const shareValue = investmentAmount / pricePerShare;
      this.buyForm.get('share').setValue(shareValue.toFixed(2));
    } else {
      this.buyForm.get('share').setValue('');
    }
  }
  formatInput(event: any) {
    // Get the input element and its value
    const inputElement = event.target;
    let value = inputElement.value;

    // Remove non-numeric characters and commas
    value = value.replace(/[^0-9]/g, '');

    // Parse the value as a number
    const numericValue = parseInt(value, 10);
  
    // Check if the parsed value is not NaN
    if (!isNaN(numericValue)) {
      // Add thousand separators
      this.buyForm.get('share').setValue(numericValue)
      const formattedValue = '$' + this.addThousandSeparator(numericValue.toString());
      // Update the form control value
      this.buyForm.get('InvestmentAmount').setValue(formattedValue, { emitEvent: false });
    }else if(isNaN(numericValue)){
      this.buyForm.get('share').setValue(null)
    }
  }


  private addThousandSeparator(value: string): string {
    if (!value) return '';

    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  
}
