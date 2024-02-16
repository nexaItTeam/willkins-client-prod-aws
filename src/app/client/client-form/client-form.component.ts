import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environment/env';
import { CommonService } from 'src/app/shared/common.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { FileRestrictions, RemoveEvent } from '@progress/kendo-angular-upload';
import { saveAs } from '@progress/kendo-file-saver';
import { requireCheckboxesToBeCheckedValidator } from '../require-checkboxes-to-be-checked.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { designationList, domesticcomapnyList, privatecompanyList } from 'src/app/client/option-list'
import { MatStepper } from '@angular/material/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, MatStepperModule } from '@angular/material/stepper';
import { Observable, map } from 'rxjs';
import { CurrencyPipe, Location } from '@angular/common'
import { QRCodeOverlay } from '@progress/kendo-angular-barcodes';
import { NgxWebsocketService    } from 'ngx-websocket';
@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: true, showError: true, },
    },
  ],
 
})
export class ClientFormComponent implements OnInit {
  socket: WebSocket;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('cdkStepper') cdkStepper: MatStepper | undefined;
  public designation = designationList
  public domesticCompany = domesticcomapnyList
  public privateCompany = privatecompanyList
  public investmentType: string
  clientFormA!: FormGroup;
  clientIdForm!: FormGroup;
  clientFormB!: FormGroup;
  clientFormC!: FormGroup;
  clientFormD!: FormGroup;
  clientDeclaration!: FormGroup
  address!: FormArray
  public markIdentificationFormValid: boolean = false
  public imageUrl = environment.GET_CLIENT_IMAGE
  clientIdentificationDetails!: FormGroup
  clientGeneralDetails!: FormGroup
  public formValue: any
  public clientId: string
  public myFiles: any = [
    { name: "First.txt", size: 500 },

  ];
  public showprimary: boolean = true
  public showTaxFieldY: boolean = false
  public showTaxFieldN: boolean = false
  public showForeignTaxFieldY: boolean = false
  public showForeignTaxFieldN: boolean = false
  showindividualattachment: boolean = true
  public approvalMatrices!: FormArray;
  individualAttachments!: FormArray
  clientDeclarationAttachments!: FormArray
  Trustee!: FormArray
  Director!: FormArray
  public decisionMaker!: FormArray;
  isOptional = false;
  public jointInvestor!: FormArray;
  public showFormA: boolean = false
  public showFormB: boolean = false
  public showFormC: boolean = false
  public showFormD: boolean = false
  public showForm: boolean = false
  public showTrade: boolean = false
  public showCompany: boolean = false
  public showSignatureImage: boolean = true
  public showIndividualOption1: boolean = false;
  public showIndividualOption2: boolean = false;
  public showtrustOption1: boolean = false;
  public showtrustOption2: boolean = false;
  orderForm!: FormGroup;
  items!: FormArray;
  clientCompany!: FormGroup;
  public individual1Iamge: string
  public showtrustVerification: boolean = true
  //files upload array
  public atttachments: any = []
  public individualattachments1: any = [];
  public individualatttachments2: any = []
  public companyattachments: any = []
  public trustattachments: any = []
  companyDomesticattachments: any = []
  public declarationsign1: any = []
  public declarationsign2: any = []
  public myRestrictions: FileRestrictions = {
    allowedExtensions: [".jpg", ".png", ".pdf"],
    maxFileSize: 10000000
  };
  public propertyData: any
  public canEdit: boolean = false
  public propertyAmount: number
  public propertyName: string
  maxDate: Date;
  Date: any
  public clientNumber:string | number
  public canProceed: boolean = false
  //download pdf
public formTitle : string
  @ViewChild('IndividualData') IndividualData!: ElementRef;
  @ViewChild('BankData') BankData!: ElementRef;
  @ViewChild('trustData') trustData!: ElementRef;
  @ViewChild('companyData') companyData!: ElementRef;
  @ViewChild('BeneficialData') BeneficialData!: ElementRef;
  @ViewChild('identificationData') identificationData!: ElementRef;
  @ViewChild('declarationData') declarationData!: ElementRef;
  stepperOrientation: Observable<StepperOrientation>;
  public overlay: QRCodeOverlay = {
    type: 'image',
    imageUrl: 'https://wellkinsstorageprod.blob.core.windows.net/document/wlogo.jpg',
    width: 20,
    height: 20
};

  constructor(private _fb: FormBuilder, public _commonService: CommonService, private router: ActivatedRoute,
    public spinner: NgxSpinnerService, public route: Router, breakpointObserver: BreakpointObserver,
    private location:Location,private ngxWebsocketService: NgxWebsocketService ) {
     
      this.socket = new WebSocket('ws://localhost:4200/app-identification');
      this.socket.addEventListener('message', (event) => {
       console.log(event) // Adjust this according to your message structure
      });

    this.clientId = sessionStorage.getItem('id')
    this.clientNumber = sessionStorage.getItem('client_id')
    this.maxDate = new Date();
    this.Date = new Date().toLocaleDateString();

    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
     
     
     
  }
  async ngOnInit() {
    
    this.clientIdForm = this._fb.group({

      client_type: [{ disabled: true }],
      share:[this._commonService.propertyData[0]?.share,Validators.required],
      InvestmentAmount: [null],
    });

    this.clientFormA = this._fb.group({

      title: [null],
      givennames: [null],
      surname: [],
      dob: [],
      email: [Validators.required, Validators.email],
      address: [],
      suburb: [],
      state: [],
      ispersonalprimary: [],
      postcode: [Validators.required, Validators.pattern('[1-9]{1}[0-9]{3}')],
      taxfieldY: [Validators.pattern('[1-9]{1}[0-9]{11}')],
      taxfieldN: [],
      isAustrallianResident: [],
      isForeignTax: [],
      foreigntaxfieldCountry: [],
      foreigntaxfieldTin: [],
      foreigntaxfieldResidency: [],
      password: [],
      isPolitical: [],
      soleTrader: [],
      soleTraderbusiness: [],
      soleTradersuburb: [],
      soleTraderstate: [],
      soleTraderpostcode: [],
      soleTraderABN: [],
      soleTraderhouse: [],
      soleTraderstreet: [],
      soleTraderstreet_type: [],
      assests: new FormArray([]),
      otherassests: [],
      isgain: [],
      isinheritance: [],
      issuperannuation: [],
      isfinancial: [],
      isbusiness: [],
      isother: [],
      jointInvestor: this._fb.array([]),
      phone: [Validators.required, Validators.pattern('[0-9]{1}[0-9]{9}')],
      house: [],
      street: [],
      street_type: [],
      middlename: []
    });
    this.clientFormB = this._fb.group({
      title: [null],
      givennames: [null],
      surname: [],
      dob: [],
      email: [],
      address: [],
      suburb: [],
      state: [],
      postcode: [],
      taxfieldY: [],
      taxfieldN: [],
      isAustrallianResident: [],
      isForeignTax: [],
      foreigntaxfieldY: [],
      foreigntaxfieldN: [],
      password: [],



      isPolitical: [],
      assests: new FormArray([]),
    });
    this.clientFormC = this._fb.group({
      title: [null],
      givennames: [null],
      surname: [],
      dob: [],
      email: [],
      nameT1: [],
      addressT1: [],
      suburbT1: [],
      stateT1: [],
      postcodeT1: [],
      nameT2: [],
      addressT2: [],
      suburbT2: [],
      stateT2: [],
      postcodeT2: [],
      isAdditional: [],
      trustname: [],
      trustbusinessname: [],
      trustABNname: [],
      trustsettlor: [],
      trusttype: [],
      trustcountry: [],
      isUnregulated: [],
      unregulatedTerms: [],
      unregulatedTrustName: [],
      unregulatedTrustDOB: [],
      unregulatedTrustaddress: [],
      fullsettlorname: [],
      isPolitical: [],
      isAustrallianResident: [],
      taxfieldY: [],
      taxfieldN: [],
      isForeignTax: [],
      isForeignTaxCountry: [],
      isForeignTaxTin: [],
      isForeignTaxN: [],
      assests: new FormArray([]),
      otherassests: [],
      isgain: [],
      isinheritance: [],
      isfinancial: [],
      issuperannuation: [],
      isbusiness: [],
      isother: [],
      Trustee: this._fb.array([]),
    });
    this.clientFormD = new FormGroup({
      approvalMatrices: this._fb.array([]),
      decisionMaker: this._fb.array([]),
    });
    this.clientGeneralDetails = this._fb.group({
      income_distributions: [null, [Validators.required]],
      financial_institution: [null, [Validators.required]],
      Account_name: [null, [Validators.required]],
      BSB: [null,],
      Account_number: [null, [Validators.required]],
      isForeignTax: [],
      isForeignTaxCountry: [],
      isForeignTaxTin: [],
      isForeignTaxN: [],
    });
    this.clientIdentificationDetails = this._fb.group({
      isIndividual: [],
      individual_1: [null],
      individual_2_categoryA: [null],
      individual_2_categoryB: [],
      company_verification_privatedomestic: [],
      company_verification_domestic: [],
      trust_regulated: [],
      trust_unregulated: [],
      istrust: [],
      files: [],
      individualoption2_files: [''],
      individualoption2_files_2: [''],

      trust_files: [''],
      trust_files_unregulated: [''],
      privateCompany: [null],
      DomesticCompany: [null],
      isTrustregulated: new FormControl(false),
      isTrustunregulated: new FormControl(false),
      individualAttachments: this._fb.array([]),
    });
    this.clientDeclaration = this._fb.group({

      signature_1_name: [],
      signature_1_middlename: [],
      signature_1_surname: [],
      signature_1_date: [],
      signature_1_title: [],
      signaturefilename: [],
      clientDeclarationAttachments: this._fb.array([]),
    });
    this.clientCompany = this._fb.group({


      principalAddress: [],
      principalSuburb: [],
      principalState: [],
      principalpostcode: [],
      principalhouse: [],
      principalhousestreet: [],
      principalhousestreet_type: [],
      companyname: [],
      suburb: [],
      state: [],
      house: [],
      street: [],
      street_type: [],
      postcode: [Validators.required, Validators.pattern('[1-9]{1}[0-9]{3}')],
      companycountry: [],
      companyABNname: [],
      companyACNname: [],
      isgain: [],
      isinheritance: [],
      issuperannuation: [],
      isfinancial: [],
      isbusiness: [],
      isother: [],
      isAustrallianResident: [],
      taxfieldY: [],
      isForeignTax: [],
      isForeignTaxCountry: [],
      isForeignTaxTin: [],
      isForeignTaxN: [],
      Director: this._fb.array([]),
    });
    this.clientDeclaration.get('signature_1_date').setValue(this.Date)
    this.isAustrallianResidentChange()
    this.patchData()
  }
  public stateList = [{
    type: "New South Wales",
    value: "NSW"
  },
  {
    type: " Victoria",
    value: "VIC"
  },
  {
    type: "Queensland",
    value: "QLD"
  },
  {
    type: "Western Australia",
    value: "WA"
  },
  {
    type: "South Australia",
    value: "SA"
  },
  {
    type: "Tasmania",
    value: "TAS"
  },
  ]
  public titleList = [{
    type: "Mr.",
    value: "Mr."
  }, {
    type: "Mrs.",
    value: "Mrs."
  },
  {
    type: "Ms.",
    value: "Ms."
  },
  {
    type: "Jr.",
    value: "Jr."
  },
  {
    type: "Dr.",
    value: "Dr."
  },
  {
    type: "Sr.",
    value: "Sr."
  },
  {
    type: "Prof.",
    value: "Prof."
  },
  {
    type: "St.",
    value: "St."
  }
  ]
  public foreignTaxList = [{
    type: "The country of tax residency does not issue TINs",
    value: ""
  },
  {
    type: "I have not been issued with a TIN",
    value: ""
  },
  {
    type: "The country of tax residency does not require the TIN to be disclosed",
    value: ""
  }]
  public list = [{
    type: "Individual / Joint holding ",
    value: "Individual",
  },
  {
    type: "Unregulated trust with individual trustee including Family Trust",
    value: "Unregulated"
  },
  {
    type: "Regulated trust with individual trustee including SMSFs",
    value: "Regulated"
  },
  {
    type: "Unregulated trust with corporate trustee including Family Trust",
    value: "Unregulated Corporate"
  },
  {
    type: "Regulated trust with corporate trustee including SMSFs",
    value: "Regulated Corporate"
  },
  {
    type: "Australian proprietary company",
    value: "Company"
  },
  {
    type: "Australian public company ",
    value: "Australian public company"
  },
  ]
  public responseList = [{
    type: "YES",
    value: "Y",
    checked: false,
    disabled: false
  },
  {
    type: "NO",
    value: "N",
    checked: false,
    disabled: false
  }]

  public politicalList = [{
    type: "YES",
    value: "Y",
    checked: false,
    disabled: false
  },
  {
    type: "NO",
    value: "N",
    checked: false,
    disabled: false
  }]
  public individualIdentificationList = [{
    type: 'OPTION 1 — provide ONE original certified copy of one primary identification document',
    value: 1
  },
  {
    type: 'OPTION 2 — provide TWO original certified copies of secondary identification documents One from A and one from B',
    value: 2
  },
  ]
  public verificationList = [{
    verificationType: "1) Valid Australian state or territory driver’s licence containing a photograph of the person"
  },
  {
    verificationType: "2) Australian passport (a passport expired within the preceding two years is acceptable)"
  },
  {
    verificationType: "3) Card issued by a state or territory for the purposes of providing a person’s age containing a photograph of the person"
  },
  {
    verificationType: "4) Valid foreign passport or similar travel document containing a photograph and the signature of the person (and if applicable, an English translation by an accredited translator)"
  },]
  public individualVerificationOption = [{
    verificationType: "OPTION 1 — provide ONE original certified copy of one primary identification document",
    value: "option1",
    isDisabled: false,
    ischecked: false
  },
  {
    verificationType: "provide TWO original certified copies of secondary identification documents One from A and one from B",
    value: "option2",
    isDisabled: true,
    ischecked: false
  },
  ]
  public trustVerificationOption = [{
    verificationType: "Option 1 — Regulated Trusts Provide a copy of one identification document",
    value: "option1",
    isDisabled: false,
    ischecked: false
  },
  {
    verificationType: "Option 2 — Unregulated Trusts Provide an original certified copy of one identification document",
    value: "option2",
    isDisabled: true,
    ischecked: false
  },
  ]
  public regulatedTrustlist = [{
    verificationType: "An original certified copy or extract of the trust deed ",
    value: "regulatedT2",

  }]
  public unregulatedTrustlist = [{
    verificationType: "An original certified copy or extract of the trust deed",
    value: "unregulatedT1",

  }, {
    verificationType: "A letter from a solicitor or qualified accountant that confirms the name of the trust and settlor (if relevant); ",
    value: "unregulatedT2",

  },
  {
    verificationType: "An original bank statement in the name of the trust issued within the last 12 months; ",
    value: "unregulatedT3",

  }
  ]
  public individualVerificationA = [
    {
      "type": '1) Australian birth certificate',
    },
    {
      "type": '2) Australian citizenship certificate',
    },
    {
      "type": '3) Foreign citizenship certificate (and if applicable, an English translation by an accredited translator)',
    },
    {
      "type": '4) Foreign birth certificate (and if applicable, an English translation by an accredited translator)',
    },
    {
      "type": '5) Pension card issued by Centrelink',
    },
    {
      "type": '6) Health card issued by Centrelink',
    },
    {
      "type": '7) Valid Medicare card',
    },
  ]
  public individualVerificationB = [
    {
      "type": '1) A document issued by the Commonwealth or a state or territory within the preceding 12 months that records the provision of financial benefits',
    },
    {
      "type": '2) A document issued by the ATO within the preceding 12 months that records a debt payable by the individual to the Commonwealth (or the Commonwealth to the individual), which contains the individual’s name and residential address(block out any TFN references)',
    },
    {
      "type": '3) A document issued by a local government body or utilities provider within the preceding three months which records the provision of services to that address or to that person (must contain the individual’s name and residential address)',
    },
    {
      "type": '4) Australian marriage certificate',
    },

  ]

  get f() {
    return this.clientFormD.controls;
  }
  get f1() {
    return this.clientFormA.controls;
  }
  get f2() {
    return this.clientIdentificationDetails.controls
  }
  get f3() {
    return this.clientDeclaration.controls
  }
  get f4() {
    return this.clientFormC.controls
  }
  get f5() {
    return this.clientCompany.controls
  }
  onaddLevel(i: any) {
    this.approvalMatrices = this.f['approvalMatrices'] as FormArray;
    this.approvalMatrices.push(this.createItem());
  }
  onaddDecisionMakerLevel(i: any) {
    this.decisionMaker = this.f['decisionMaker'] as FormArray;
    this.decisionMaker.push(this.createItem());
  }
  onaddJointHolderLevel(i: any) {
    this.jointInvestor = this.f1['jointInvestor'] as FormArray;
    this.individualAttachments = this.f2['individualAttachments'] as FormArray;
    this.clientDeclarationAttachments = this.f3['clientDeclarationAttachments'] as FormArray
    this.jointInvestor.push(this.createJointHolder());
    this.individualAttachments.push(this.createIndividualAttachment());
    this.clientDeclarationAttachments.push(this.createDeclarationAttachment(i))
  }
  onaddTrusteeLevel(i: any) {
    this.Trustee = this.f4['Trustee'] as FormArray;
    this.Trustee.push(this.createTrustee());
    this.clientDeclarationAttachments = this.f3['clientDeclarationAttachments'] as FormArray
    this.clientDeclarationAttachments.push(this.createDeclarationAttachment(i))
  }
  onaddDirectorLevel(i: any) {
    this.Director = this.f5['Director'] as FormArray;
    this.Director.push(this.createDirector());
    //add only if option are compan otherwise restrain
   /*  if (this.clientIdForm.get('client_type').value != 'Unregulated Corporate' && this.clientIdForm.get('client_type').value != 'Regulated Corporate') {
      this.clientDeclarationAttachments = this.f3['clientDeclarationAttachments'] as FormArray
      this.clientDeclarationAttachments.push(this.createDeclarationAttachment(i))
    } */
    this.clientDeclarationAttachments = this.f3['clientDeclarationAttachments'] as FormArray
      this.clientDeclarationAttachments.push(this.createDeclarationAttachment(i))
  }
  removeItem(idx: number): void {

    (this.f['approvalMatrices'] as FormArray).removeAt(idx);

  }
  removeDecisionMakerItem(idx: number): void {

    (this.f['decisionMaker'] as FormArray).removeAt(idx);

  }
  removejointholder(idx: number): void {
    (this.f1['jointInvestor'] as FormArray).removeAt(idx);
    this.removeIndividualAttachments(idx + 1)
    this.removeDeclarationAttachments(idx + 1)
  }
  removeTrustee(idx: number): void {
    (this.f4['Trustee'] as FormArray).removeAt(idx);
    this.removeDeclarationAttachments(idx)
  }
  removeCompany(idx: number): void {
    (this.f5['Director'] as FormArray).removeAt(idx);
    this.removeDeclarationAttachments(idx)
  }
  removeIndividualAttachments(i: number): void {
    (this.f2['individualAttachments'] as FormArray).removeAt(i);
  }
  removeDeclarationAttachments(i: number): void {
    (this.f3['clientDeclarationAttachments'] as FormArray).removeAt(i);
  }
  public createItem() {

    return this._fb.group({
      title: [null, [Validators.required]],
      givennames: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      middlename: [null],
      dob: [null],
      email: [null, [Validators.required, Validators.email]],

      suburb: [null, [Validators.required]],
      state: [null, [Validators.required]],
      postcode: [null, [Validators.required, Validators.pattern('[0-9]{1,4}')]],
      phone: [null, [Validators.required]],
      house: [],
      street: [],
      street_type: [],
      ispolitical: [],
      isAustrallianResident: [],
      isAustrallianResidentY: [],
      isAustrallianResidentN: [],
      isForeignResident: [],
      isForeignResidentCountry: [],
      isForeignResidentTIN: [],
      isForeignTaxN: []
    })

  }
  public createJointHolder() {

    return this._fb.group({
      title: [null, [Validators.required]],
      givennames: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      middlename: [null],
      dob: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      isjointprimary: [null],
      suburb: [null, [Validators.required]],
      state: [null, [Validators.required]],
      postcode: [null, [Validators.required, Validators.pattern('[0-9]{1,4}')]],
      taxfieldY: [],
      taxfieldN: [],
      isAustrallianResident: [null, [Validators.required]],
      isForeignTax: [],
      foreigntaxfieldY: [],
      foreigntaxfieldN: [],
      foreigntaxfieldYTIN: [],
      password: [],
      isPolitical: [],
      assests: [],
      isgain: [],
      isfinancial: [],
      issuperannuation: [],
      isbusiness: [],
      isother: [],
      phone: [null, [Validators.required, Validators.pattern('[0-9]{1}[0-9]{9}')]],
      house: [],
      street: [],
      street_type: [],
      otherassests: [],

    })

  }
  createTrustee() {
    return this._fb.group({
      title: [null, [Validators.required]],
      givennames: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      middlename: [null,],
      dob: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      isprimary: [null],
      suburb: [null, [Validators.required]],
      state: [null, [Validators.required]],
      postcode: [null, [Validators.required, Validators.pattern('[0-9]{1,4}')]],
      taxfieldY: [],
      taxfieldN: [],
      isAustrallianResident: [null],
      isForeignTax: [],
      isForeignTaxCountry: [],
      isForeignTaxTin: [],
      password: [],
      isPolitical: [],
      isForeignTaxN: [],
      assests: [],
      isgain: [],
      isfinancial: [],
      issuperannuation: [],
      phone: [null, [Validators.required]],
      house: [],
      street: [],
      street_type: [],
      otherassests: [],
      isother: [],
      isbusiness: []
    })
  }
  createDirector() {
    return this._fb.group({

      directornames: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      middlename: [null,],
      title: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],
      iscompanyprimary: [null]
    })
  }
  createIndividualAttachment() {
    return this._fb.group({
      individual: [],
      individual_1: [],
      individual_2: [],
      individual_1_doc: [],

      individual_2_categoryB_doc: [],
      individual_2_categoryA_doc: [],
      individualoption1_files: [],
      individualoption2_files: [],
      individualoption2_files_2: [],

    })
  }
  createDeclarationAttachment(i) {
    return this._fb.group({

      signature_1_name: [],
      signature_1_date: [new Date().toDateString()],
      signature_1_title: [],
      signaturefilename: [],
      designation: []
    })
  }

  /*  toggle(data: any,item:any) {
     this.politicalList[0].checked =false;
     this.politicalList[1].checked=false;
     this.politicalList[0].disabled =false
     this.politicalList[1].disabled=false
     if(data.checked && item =="Y"){
       this.politicalList[1].disabled=true
       this.politicalList[1].checked = false
     this.clientFormA.get('isPolitical')!.setValue(item);
     }
     if(data.checked && item =="N"){
       this.politicalList[0].disabled=true
       this.politicalList[0].checked = false
     this.clientFormA.get('isPolitical')!.setValue(item);
     }
   }
 
   taxValue(checkedData: any, item: any) {
    this.responseList[0].checked =false;
     this.responseList[1].checked=false;
     this.responseList[0].disabled =false
     this.responseList[1].disabled=false
     
     this.showTaxFieldY = false
     this.showTaxFieldN = false
     if (item == 'Y' && checkedData.checked == true) {
       this.showTaxFieldY = true 
       this.responseList[1].disabled =true
     } else if(item == 'N' && checkedData.checked == true) {
       this.showTaxFieldN =true
       this.responseList[0].disabled =true
     }
   } */
  checkformValidation(formType) {

    switch (formType) {
      case 'Individual':
        if (this.clientFormA.valid && this.clientDeclaration.valid && this.clientIdentificationDetails.valid && this.clientGeneralDetails.valid) {
          this.canProceed = true
          if (this.clientFormA.get('ispersonalprimary').value == "Y") {
            this.canProceed = true
          } else if (this.primaryIndex != undefined) {
            this.canProceed = true
          } else {
            this.canProceed = false
            alert('There must be atleast one person for correspondence please select yes/no under Individual Form')
          }
        }
        break;

      case 'Unregulated':
        if (this.clientFormC.valid && this.clientFormD.valid && this.clientDeclaration.valid && this.clientIdentificationDetails.valid && this.clientGeneralDetails.valid) {
          if (this.primaryIndex != undefined) {
            this.canProceed = true
          } else {
            this.canProceed = false
            alert('There must be atleast one person for correspondence please select under trust form')
          }
        }
        break;
      case 'Regulated':
        if (this.clientFormC.valid && this.clientDeclaration.valid && this.clientIdentificationDetails.valid && this.clientGeneralDetails.valid) {
          if (this.primaryIndex != undefined) {
            this.canProceed = true
          } else {
            this.canProceed = false
            alert('There must be atleast one person for correspondence please select under trust form')
          }
        }
        break;
      case "Unregulated Corporate":
        if (this.clientCompany.valid && this.clientFormC.valid && this.clientFormD.valid && this.clientDeclaration.valid && this.clientIdentificationDetails.valid && this.clientGeneralDetails.valid) {

          if (this.primaryIndex != undefined) {
            this.canProceed = true
          } else {
            this.canProceed = false
            alert('There must be atleast one person for correspondence please select under company form')
          }
        }
        break;
      case "Regulated Corporate":
        if (this.clientCompany.valid && this.clientFormC.valid && this.clientDeclaration.valid && this.clientIdentificationDetails.valid && this.clientGeneralDetails.valid) {

          if (this.primaryIndex != undefined) {
            this.canProceed = true
          } else {
            this.canProceed = false
            alert('There must be atleast one person for correspondence please select under company form')
          }
        }
        break;
      case "Company":
        if (this.clientCompany.valid && this.clientFormD.valid && this.clientDeclaration.valid && this.clientIdentificationDetails.valid && this.clientGeneralDetails.valid) {
          if (this.primaryIndex != undefined) {
            this.canProceed = true
          } else {
            this.canProceed = false
            alert('There must be atleast one person for correspondence please select under company form')
          }
        }
        break;
      case "Australian public company":
        if (this.clientCompany.valid && this.clientIdentificationDetails.valid && this.clientGeneralDetails.valid && this.clientDeclaration.valid) {
          if (this.primaryIndex != undefined) {
            this.canProceed = true
          } else {
            this.canProceed = false
            alert('There must be atleast one person for correspondence please select under company form')
          }
        }
        break;
    }
  }
  onSubmit() {
    
    this.canProceed = false
    this.spinner.show()
    this.checkformValidation(this.clientIdForm.get('client_type').value)
    if (this.canProceed) {


      if (this.atttachments.length != 0) {
        this.uploadFileAttachments()
      }
      if (this.individualattachments1.length != 0) {
        this.uploadindividualoption_2()
      }
      if (this.individualatttachments2.length != 0) {
        this.uploadindividualoption_2_1()
      }
      if (this.trustattachments.length != 0) {
        this.uploadtrustfiles()
      }
      if (this.companyattachments.length != 0) {
        this.uploadcompanyfiles()
      }
      if (this.clientIdForm.get('client_type').value == 'Individual') {
        var clients = []
        const jointInvestorValue = this.clientFormA.value
        for (let i = 0; i < jointInvestorValue.jointInvestor.length; i++) {
          clients.push({
            "full_name": jointInvestorValue.jointInvestor[i].givennames + " " + jointInvestorValue.jointInvestor[i].surname,
            "password": Math.random().toString(36).slice(-8),
            "client_email": jointInvestorValue.jointInvestor[i].email,
            "contact_no": jointInvestorValue.jointInvestor[i].phone
          })
        }
      }
      const newStr = Number(this.clientIdForm.get('InvestmentAmount').value.replace(/[^0-9.-]+/g,""));
      const body = {
        "enq_form": {
          "client_id": this.clientId,
          "primary_index": this.primaryIndex != undefined ? this.primaryIndex : undefined,
          "prop_id": this._commonService.propertyData[1].id,
          "investing_amount":newStr,
          "investment_unit":  this.clientIdForm.get('share').value,
          "paidStatus": false,
         // id: this.formValue != undefined ? this.formValue.id : null,
          "isDraft": false,
          "form_a":
            this.clientFormA.value,

          "form_b":
            this.clientFormB.value,

          "form_c": this.clientFormC.value,
          "form_d": this.clientFormD.value,
          "form_e": this.clientGeneralDetails.value,
          "form_f": this.clientIdentificationDetails.value,
          "form_g": this.clientDeclaration.value,
          "form_h": this.clientCompany.value,
          "investor_form_type": this.clientIdForm.get('client_type').value,
          clients: clients
        }
      }
      if (this.formValue != undefined) {
        this._commonService.saveClientDraft(body).subscribe((res: any) => {
          this.spinner.hide()
          alert("Submitted succesfully")
          this.route.navigate(['client/view-investment'])

        },
          Error => {
            this.spinner.hide()
            alert('Something went wrong!');
          }
        )
      } else {
        this._commonService.postClientDetail(body).subscribe((res: any) => {
          this.spinner.hide()
          alert("Submitted succesfully")
          this.route.navigate(['client/view-investment'])
        },
          Error => {
            this.spinner.hide()
            alert('Something went wrong!');
          },
        )
      }


    }
    else {
      this.spinner.hide()
      alert("please fill the form correctly")

    }
  }

  onSaveDraft() {
   
    this.spinner.show()
    if (this.atttachments.length != 0) {
      this.uploadFileAttachments()
    }
    if (this.individualattachments1.length != 0) {
      this.uploadindividualoption_2()
    }
    if (this.individualatttachments2.length != 0) {
      this.uploadindividualoption_2_1()
    }
    if (this.trustattachments.length != 0) {
      this.uploadtrustfiles()
    }
    if (this.companyattachments.length != 0) {
      this.uploadcompanyfiles()
    }



    var body = {
      "enq_form": {
        "client_id": this.clientId,
        "isDraft": true,
        "primary_index": this.primaryIndex != undefined ? this.primaryIndex : undefined,

        id: this.formValue != undefined ? ( this.formValue.isDraft ? this.formValue.id:null ) : null,
        "form_a":
          this.clientFormA.value,

        "form_b":
          this.clientFormB.value,

        "form_c": this.clientFormC.value,
        "form_d": this.clientFormD.value,
        "form_e": this.clientGeneralDetails.value,
        "form_f": this.clientIdentificationDetails.value,
        "form_g": this.clientDeclaration.value,
        "form_h": this.clientCompany.value,
        "investor_form_type": this.clientIdForm.get('client_type').value
      }
    }
    if (this.formValue != undefined) {
      this._commonService.saveClientDraft(body).subscribe((res: any) => {

        alert("Draft Saved succesfully")
        this.spinner.hide()
      })
    } else {

      this._commonService.postClientDetail(body).subscribe((res: any) => {

        alert("Draft Saved succesfully")
        this.spinner.hide()
      })
    }
  }
  onClientFormAChange(event: any, form) {

    switch (form) {
      case 'A':
        var formArray: FormArray = this.clientFormA.get('assests') as FormArray
        break;
      case 'B':
        var formArray: FormArray = this.clientFormA.get('assests') as FormArray
        break;
      case 'C':
        var formArray: FormArray = this.clientFormC.get('assests') as FormArray
        break;
    }
    /* Selected */
    if (event.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.source.value));
    }
    /* unselected */
    else {
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: any) => {
        if (ctrl.value == event.source.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }
  public async patchFormValue() {

    var res: any = []
    const body = {
      "client_id": this.clientId,
      "investor_form_type": this.clientIdForm.get('client_type').value
    }
    this.spinner.show()
    res = this._commonService.getClientDetail(body).subscribe((res: any) => {

      if (res.enq_form[0] != null) {


        //   this.onInvestorChange(this.clientIdForm.get('client_type').value)
        this.formValue = res.enq_form[0]
        // this.clientIdForm.patchValue({'client_type': this._commonService.propertyData[0].InvestmentType })

        this.clientFormA.patchValue(this.formValue.form_a);
        this.clientFormB.patchValue(this.formValue.form_b);
        this.clientFormC.patchValue(this.formValue.form_c);
        this.clientFormD.patchValue(this.formValue.form_d);
        this.clientCompany.patchValue(this.formValue.form_h)
        this.clientIdentificationDetails.patchValue(this.formValue.form_f)
        this.clientGeneralDetails.patchValue(this.formValue.form_e)
        this.clientDeclaration.patchValue(this.formValue.form_g)
        this.primaryIndex = this.formValue.primary_index
        this.showprimary = false
        // this.getCheckBoxValue();
        this.getFormArrayValue();
        this.pushSign_Declaration();


        this.spinner.hide()



      } else {
        // this.spinner.show()
        //  this.clientIdForm.patchValue({'client_type': this._commonService.propertyData[0].InvestmentType })
        // this.pushSign_Declaration()
        //  this.onInvestorChange(this._commonService.propertyData[0].InvestmentType)

        // this.onaddDirectorLevel(0)
        // this.onaddLevel(0)
        switch (this.clientIdForm.get('client_type').value) {
          case 'Regulated':
            this.onaddTrusteeLevel(0)
            break;
          case 'Unregulated':
            this.onaddTrusteeLevel(0)
            this.onaddLevel(0)
            break;
          case 'Regulated Corporate':
          //  this.onaddTrusteeLevel(0)
            this.onaddDirectorLevel(0)
            break;
          case 'Unregulated Corporate':
           // this.onaddTrusteeLevel(0)
            this.onaddDirectorLevel(0)
            this.onaddLevel(0)
            break;
          case 'Company':
            this.onaddDirectorLevel(0)
            this.onaddLevel(0)
            break;
          case "Australian public company":
            for (let i = 0; i < 3; i++) {
              this.onaddDirectorLevel(i)

            }
            break;
        }



        this.spinner.hide()
      }
    },
    )

  }



  clearValidations(): void {
    const controlKeys = Object.keys(this.clientIdentificationDetails.controls);
    controlKeys.forEach((controlKey) => {
      const field = this.clientIdentificationDetails.controls[controlKey];
      field.clearValidators();
      /* const currentValue = field.value;
      field.setValue("fakeValue");
      field.setValue(currentValue); */
    });
  }
  async onInvestorChange(option) {

    this.clearValidations()


    this.showdomestic = true
    this.showprivate = true;
    this.showUnregulated_FR = true
    this.showUnregulated_UR = true
    this.showregulatedC_FR = true
    this.showregulatedC_UR = true
    this.showregulated_FR = true
    this.showregulated_UR = true
    this.showUnregulatedC_FR = true
    this.showUnregulatedC_UR = true
    this.primaryIndex = undefined
    this.formValue = undefined
    this.clientFormA.reset();
    this.clientFormB.reset();
    this.clientFormC.reset();
   
    this.clientFormD.reset();
    this.clientGeneralDetails.reset();
    this.clientIdentificationDetails.reset();
    this.clientDeclaration.reset()
    this.showForm = true;
    this.showFormA = false;
    this.showFormB = false;
    this.showFormC = false;
    this.showFormD = false;
    this.showCompany = false;
    this.showTaxFieldY = false
    this.jointInvestor = this.f1['jointInvestor'] as FormArray;
    this.jointInvestor.controls = []
    this.individualAttachments = this.f2['individualAttachments'] as FormArray;
    this.individualAttachments.controls = []

    this.Trustee = this.f4['Trustee'] as FormArray;
    this.Trustee.controls = []
  
    this.Director = this.f5['Director'] as FormArray
    this.Director.controls = []
    this.approvalMatrices = this.f['approvalMatrices'] as FormArray
    this.approvalMatrices.controls = []

    //push trustee when user has first time checked 
    this.clientDeclarationAttachments = this.f3['clientDeclarationAttachments'] as FormArray;
    for (let i = 0; i < this.clientDeclarationAttachments.controls.length; i++) {
      this.removeDeclarationAttachments(i)
    }

    this.clientDeclarationAttachments = this.f3['clientDeclarationAttachments'] as FormArray;
    this.clientDeclarationAttachments.controls = []



    /* if(option =="Australian public company" && !this.canEdit){
      this.onaddDirectorLevel(0)
    } */
    switch (option) {
      case "Individual":
        this.showFormA = true

        break;
      case "Unregulated":

        this.showFormC = true
        this.showFormD = true
        break;
      case "Regulated":
        this.showFormC = true
        break;
      case "Company":
        this.showCompany = true
        this.showFormD = true
        break;
      case "Unregulated Corporate":
        this.showCompany = true
        this.showFormD = true
        this.showFormC = true
        break;
      case "Regulated Corporate":
        this.showCompany = true
        this.showFormC = true
        break;
      case "Australian public company":
        this.showCompany = true
        break;
    }
    if (!this.canEdit) {
      await this.patchFormValue()
    }
    //push indivudal declaration on dd change to patch 1 value 
    /* if(option == "Individual"){
     this.pushDeclaration("Individual")
       } */
    //push declaration if not trustee or company
    if (option != "Unregulated" && option != "Company") {
      this.pushOnchangeAttachments()
    }
    this.move()
  }
  //after selection change move stepper back to 1 positon
  move() {
    this.stepper.selectedIndex = 0;
  }
  onAustrallianResidentChange(value, i, formnumber) {
    
//show errors on dropdown changes
    if (value == "Y") {
      this.f1?.jointInvestor['controls'][i].controls.taxfieldY.setValidators([Validators.required])
      //make them error free on any dd change to y option
      this.f1?.jointInvestor['controls'][i ].controls.foreigntaxfieldY.setErrors(null)
      this.f1?.jointInvestor['controls'][i ].controls.isForeignTax.setErrors(null)
     
        this.f1?.jointInvestor['controls'][i ].controls.foreigntaxfieldYTIN.setErrors(null)
        this.f1?.jointInvestor['controls'][i ].controls.foreigntaxfieldN.setErrors(null)

    } else {
      this.f1?.jointInvestor['controls'][i ].controls.isForeignTax.setValidators([Validators.required])
     
      this.f1?.jointInvestor['controls'][i ]?.controls?.taxfieldY?.setErrors(null)

    }
    /*  switch(formnumber){
       case 'Individual-A':
     if(option.value =="Y"){
       
      this.f1?.jointInvestor['controls'][i].controls.taxfieldY.setValidators([Validators.required])
         }else {
           this.f1?.jointInvestor['controls'][i].controls.taxfieldY.setValidators(null)
         }if(option.value =="N"){
           
           
           this.f1?.jointInvestor['controls'][i].controls.isForeignTax.setValidators([Validators.required])
           
         }else{
           this.f1?.jointInvestor['controls'][i].controls.isForeignTax.setValidators(null)
         }
         break;
   
       } */

  }
  onisForeignTaxChange(option) {
    if (option.value == "Y") {
      this.showForeignTaxFieldY = true
      this.showForeignTaxFieldN = false
    } else {

      this.showForeignTaxFieldY = false
      this.showForeignTaxFieldN = true
    }
  }
  onregulateTrustChange(option) {
    if (option.value == "Y") {
      this.showForeignTaxFieldY = true
      this.showForeignTaxFieldN = false
    } else {

      this.showForeignTaxFieldY = false
      this.showForeignTaxFieldN = true
    }
  }
  isIndividualCheckbox(checkedData: any, item: any, i) {

    if (checkedData) {
      switch (item) {
        case 'individual_1':
          this.f2?.individualAttachments['controls'][i]?.controls?.individual_1?.setValue(true)
          break;
        case 'individual_2':
          this.f2?.individualAttachments['controls'][i]?.controls?.individual_2?.setValue(true)
          break;

      }
    } else {
      switch (item) {
        case 'individual_1':
          this.f2?.individualAttachments['controls'][i]?.controls?.individual_1?.setValue(false)
          break;
        case 'individual_2':
          this.f2?.individualAttachments['controls'][i]?.controls?.individual_2?.setValue(false)
          break;

      }
    }
  }
  isIndividualchange(checkedData: any, item: any) {

    // this.individualVerificationOption[0].checked =false;
    //  this.responseList[1].checked=false;

    this.individualVerificationOption[0].isDisabled = false
    this.individualVerificationOption[1].isDisabled = false

    this.showIndividualOption1 = false
    this.showIndividualOption2 = false
    if (item == 'option1' && checkedData == true) {
      this.showIndividualOption1 = true
      this.individualVerificationOption[0].ischecked = true
      this.clientIdentificationDetails.get('isIndividual').setValue('option1')
      this.individualVerificationOption[1].isDisabled = true
    } else if (item == 'option2' && checkedData == true) {
      this.showIndividualOption2 = true
      this.individualVerificationOption[1].ischecked = true
      this.individualVerificationOption[0].isDisabled = true
      this.clientIdentificationDetails.get('isIndividual').setValue('option2')
    } else if (checkedData == false) {
      this.clientIdentificationDetails.get('isIndividual').setValue('')
      this.individualVerificationOption[1].ischecked = false
      this.individualVerificationOption[1].ischecked = false
    }
  }

  isTrustchange(checkedData: any, item: any) {

    this.trustVerificationOption[0].isDisabled = false
    this.trustVerificationOption[1].isDisabled = false
    this.showtrustOption2 = false
    this.showtrustOption1 = false
    if (item == 'option1' && checkedData == true) {
      this.showtrustOption1 = true
      this.trustVerificationOption[1].isDisabled = true
      this.trustVerificationOption[0].ischecked = true
      this.clientIdentificationDetails.get('istrust').setValue('option1')
    } else if (item == 'option2' && checkedData == true) {
      this.showtrustOption2 = true
      this.trustVerificationOption[0].isDisabled = true
      this.trustVerificationOption[1].ischecked = true
      this.clientIdentificationDetails.get('istrust').setValue('option2')
    }
    else if (checkedData == false) {
      this.clientIdentificationDetails.get('istrust').setValue('')
      this.individualVerificationOption[1].ischecked = false
      this.individualVerificationOption[1].ischecked = false
    }
  }
  onIndividualFileSelect(event: any, type: any, i) {
    if (this.formValue != undefined) {
      if (this.formValue.form_f.individualAttachments.length > i) {
        this.formValue.form_f.individualAttachments[i].individualoption1_files = null
        this.formValue.form_f.individualAttachments[i].individualoption2_files = null
        this.formValue.form_f.individualAttachments[i].individualoption2_files_2 = null
      } else { }
    } else { }
    if (!event.files[0].validationErrors) {
      let individualAttachment = []
      individualAttachment = [...individualAttachment, ...event.files]
     // this.atttachments = []
      this.atttachments = [...this.atttachments, ...event.files]
      this.f2?.individualAttachments['controls'][i].controls.individualoption1_files.setValue(individualAttachment[0].name)
      this.f2?.individualAttachments['controls'][i].controls.individualoption1_files.setErrors(null)
    } else {
      this.f2?.individualAttachments['controls'][i].controls.individualoption1_files.setErrors({ 'invalid': true })
    }
  }

  onIndividualFileSelect2(event: any, type: any, i) {
     
    if (this.formValue != undefined) {
      if (this.formValue.form_f.individualAttachments.length > i) {
        this.formValue.form_f.individualAttachments[i].individualoption1_files = null
        this.formValue.form_f.individualAttachments[i].individualoption2_files = null
        this.formValue.form_f.individualAttachments[i].individualoption2_files_2 = null
      }
    } else { }
    switch (type) {
      case 'Individual_2_1':
        if (type == "Individual_2_1" && !event.files[0].validationErrors) {
          let individualAttachment = []
          individualAttachment = [...individualAttachment, ...event.files]
        //  this.individualattachments1 = []
          this.individualattachments1 = [...this.individualattachments1, ...event.files]
          this.f2?.individualAttachments['controls'][i].controls.individualoption2_files.setValue(individualAttachment[0].name)
          this.f2?.individualAttachments['controls'][i].controls.individualoption2_files.setErrors(null)
        }
        else {
          this.f2?.individualAttachments['controls'][i].controls.individualoption2_files.setErrors({ 'invalid': true })
        }
        break;
      case 'Individual_2_2':
        if (type == "Individual_2_2" && !event.files[0].validationErrors) {
         // this.individualatttachments2 = []
          var individualAttachment = []
          individualAttachment = [...individualAttachment, ...event.files]
          this.individualatttachments2 = [...this.individualatttachments2, ...event.files]
          this.f2?.individualAttachments['controls'][i].controls.individualoption2_files_2.setValue(individualAttachment[0].name)
          this.f2?.individualAttachments['controls'][i].controls.individualoption2_files_2.setErrors(null)
        }
        else {
          this.f2?.individualAttachments['controls'][i].controls.individualoption2_files_2.setErrors({ 'invalid': true })
        }
    }


  }
  public showUnregulated_FR: boolean = true
  public showUnregulated_UR: boolean = true
  public showregulatedC_FR: boolean = true
  public showregulatedC_UR: boolean = true
  public showregulated_FR: boolean = true
  public showregulated_UR: boolean = true
  public showUnregulatedC_FR: boolean = true
  public showUnregulatedC_UR: boolean = true

  onTrustFileSelect(event: any, type: any) {

    switch (this.clientIdForm.get('client_type').value) {
      case "Unregulated":
        if (type == 'regulated') {
          this.showUnregulated_FR = false
        }
        else {
          this.showUnregulated_UR = false
        }
        break;
      case "Regulated Corporate":
        if (type == 'regulated') {
          this.showregulatedC_FR = false
        }
        else {
          this.showregulatedC_UR = false
        }
        break;
      case "Regulated":
        if (type == 'regulated') {
          this.showregulated_FR = false
        }
        else {
          this.showregulated_UR = false
        }
        break;
      case "Unregulated Corporate":
        if (type == 'regulated') {
          this.showUnregulatedC_FR = false
        }
        else {
          this.showUnregulatedC_UR = false
        }
        break;
    }
    switch (type) {
      case 'regulated':
        if (type == "regulated" && !event.files[0].validationErrors) {

          this.trustattachments = []
          this.trustattachments = [...this.trustattachments, ...event.files]
          this.clientIdentificationDetails.get('trust_files').setValue(this.trustattachments[0].name)
          this.clientIdentificationDetails.get('trust_files').setErrors(null)
        } else {
          this.clientIdentificationDetails.get('trust_files').setErrors({ 'invalid': true })
        }
        break;
      case 'unregulated':
        if (type != "regulated" && !event.files[0].validationErrors) {

          this.trustattachments = []
          this.trustattachments = [...this.trustattachments, ...event.files]
          this.clientIdentificationDetails.get('trust_files_unregulated').setValue(this.trustattachments[0].name)
          this.clientIdentificationDetails.get('trust_files_unregulated').setErrors(null)
        } else {
          this.clientIdentificationDetails.get('trust_files_unregulated').setErrors({ 'invalid': true })
        }
    }


  }
  public showdomestic: boolean = true
  public showprivate: boolean = true
  onCompanyFileSelect(event: any, type: any) {

    this.showtrustVerification = false;
    switch (this.clientIdForm.get('client_type').value) {

      case "Australian public company":
        if (type == 'domestic') {
          this.showdomestic = false
        }

        break;
      case "Company":
        if (type == 'private') {
          this.showprivate = false
        }

        break;

    }
    switch (type) {
      case 'private':
        if (type == "private" && !event.files[0].validationErrors) {
          this.companyattachments = []
          this.companyattachments = [...this.companyattachments, ...event.files]
          this.clientIdentificationDetails.get('company_verification_domestic').setValue(this.companyattachments[0].name)
          this.clientIdentificationDetails.get('company_verification_domestic').setErrors(null)
        }
        else {
          this.clientIdentificationDetails.get('company_verification_domestic').setErrors({ 'invalid': true })
        }
        break;
      case 'domestic':
        if (type == "domestic" && !event.files[0].validationErrors) {
          this.companyattachments = []
          this.companyDomesticattachments = []
          this.companyDomesticattachments = [...this.companyDomesticattachments, ...event.files]
          this.clientIdentificationDetails.get('company_verification_privatedomestic').setValue(this.companyDomesticattachments[0].name)
          this.clientIdentificationDetails.get('company_verification_privatedomestic').setErrors(null)
        }
        else {
          this.clientIdentificationDetails.get('company_verification_privatedomestic').setErrors({ 'invalid': true })
        }
        break;
    }

  }
  onFileSelect(event: any, type: any) {
   // this.atttachments = []
    this.atttachments = [...this.atttachments, ...event.files]

  }
  oncompanyFileSelect(event, type) {
    this.companyattachments = []
    this.companyattachments = [...this.companyattachments, ...event.files]
  }
  onDeclarationsign2(event, type) {
    this.declarationsign2 = []
    this.declarationsign2 = [...this.declarationsign2, ...event.files]
    this.clientDeclaration.get('signatue_2_files').setValue(this.declarationsign2[0].name)
  }
  onDeclarationsign1(event, type, i) {


    this.showSignatureImage = false
    var imagefilename = []
    imagefilename = [...imagefilename, ...event.files]


    this.declarationsign1 = [...this.declarationsign1, ...event.files]

    this.f3?.clientDeclarationAttachments['controls'][i].controls.signaturefilename.setValue(imagefilename[0].name)
  }
  public removeSignature(e: RemoveEvent, i): void {

    this.f3?.clientDeclarationAttachments['controls'][i].controls.signaturefilename.setValue(null)
    const index = this.declarationsign1.findIndex(
      (item) => item.uid === e.files[0].uid
    );

    if (index >= 0) {
      this.declarationsign1.splice(index, 1);
    }
  }
  public removeIndividualFile(e: RemoveEvent, i, filename): void {

    switch (filename) {
      case 'Individual_2_2':
        this.f2?.individualAttachments['controls'][i].controls.individualoption2_files_2.setValue('')
        this.f2?.individualAttachments['controls'][i].controls.individualoption2_files_2.setErrors({ 'invalid': true })
        const index = this.individualatttachments2.findIndex(
          (item) => item.uid === e.files[0].uid
        );

        if (index >= 0) {
          this.individualatttachments2.splice(index, 1);
        }

        break;
      case 'Individual_2_1':
        this.f2?.individualAttachments['controls'][i].controls.individualoption2_files.setValue(null)
        this.f2?.individualAttachments['controls'][i].controls.individualoption2_files.setErrors({ 'invalid': true })
        const index1 = this.individualattachments1.findIndex(
          (item) => item.uid === e.files[0].uid
        );

        if (index1 >= 0) {
          this.individualatttachments2.splice(index1, 1);
        }

        break;
      case 'Individual_1':
        this.f2?.individualAttachments['controls'][i].controls.individualoption1_files.setValue('')
        this.f2?.individualAttachments['controls'][i].controls.individualoption1_files.setErrors({ 'invalid': true })
        const index2 = this.atttachments.findIndex(
          (item) => item.uid === e.files[0].uid
        );

        if (index2 >= 0) {
          this.individualatttachments2.splice(index2, 1);
        }

        break;
    }
  }
  getFormArrayValue() {
    if (this.formValue.form_d.approvalMatrices.length != 0) {
      for (let i = 0; i < this.formValue.form_d.approvalMatrices.length; i++) {
        this.approvalMatrices = this.f['approvalMatrices'] as FormArray;
        this.approvalMatrices.push(this._fb.group({

          title: [this.formValue.form_d.approvalMatrices[i].title],
          givennames: [this.formValue.form_d.approvalMatrices[i].givennames],
          middlename: [this.formValue.form_d.approvalMatrices[i].middlename],
          surname: [this.formValue.form_d.approvalMatrices[i].surname],
          dob: [this.formValue.form_d.approvalMatrices[i].dob],
          email: [this.formValue.form_d.approvalMatrices[i].email, [Validators.required, Validators.email]],
          phone: [this.formValue.form_d.approvalMatrices[i].phone],
          house: [this.formValue.form_d.approvalMatrices[i].house],
          street: [this.formValue.form_d.approvalMatrices[i].street],
          street_type: [this.formValue.form_d.approvalMatrices[i].street_type],
          suburb: [this.formValue.form_d.approvalMatrices[i].suburb],
          postcode: [this.formValue.form_d.approvalMatrices[i].postcode],
          state: [this.formValue.form_d.approvalMatrices[i].state],
          ispolitical: [this.formValue.form_d.approvalMatrices[i].ispolitical],
          isAustrallianResident: [this.formValue.form_d.approvalMatrices[i].isAustrallianResident],
          isAustrallianResidentY: [this.formValue.form_d.approvalMatrices[i].isAustrallianResidentY],
          isAustrallianResidentN: [this.formValue.form_d.approvalMatrices[i].isAustrallianResidentN],
          isForeignResident: [this.formValue.form_d.approvalMatrices[i].isForeignResident],
          isForeignResidentCountry: [this.formValue.form_d.approvalMatrices[i].isForeignResidentCountry],
          isForeignResidentTIN: [this.formValue.form_d.approvalMatrices[i].isForeignResidentTIN],
          isForeignTaxN: [this.formValue.form_d.approvalMatrices[i].isForeignTaxN]
        })
        );
      }
    } else {

    } if (this.formValue.form_d.decisionMaker.length != 0) {
      for (let i = 0; i < this.formValue.form_d.decisionMaker.length; i++) {
        this.decisionMaker = this.f['decisionMaker'] as FormArray;
        this.decisionMaker.push(this._fb.group({
          title: [this.formValue.form_d.decisionMaker[i].title],
          givennames: [this.formValue.form_d.decisionMaker[i].givennames],
          middlename: [this.formValue.form_d.decisionMaker[i].middlename],
          surname: [this.formValue.form_d.decisionMaker[i].surname],
          dob: [this.formValue.form_d.decisionMaker[i].dob],
          email: [this.formValue.form_d.decisionMaker[i].email, [Validators.required, Validators.email]],
          suburb: [this.formValue.form_d.decisionMaker[i].suburb],
          postcode: [this.formValue.form_d.decisionMaker[i].postcode],
          street: [this.formValue.form_d.decisionMaker[i].street],
          street_type: [this.formValue.form_d.decisionMaker[i].street_type],
          house: [this.formValue.form_d.decisionMaker[i].house],
          phone: [this.formValue.form_d.decisionMaker[i].phone],
          state: [this.formValue.form_d.decisionMaker[i].state],
          ispolitical: [this.formValue.form_d.decisionMaker[i].ispolitical],
          isAustrallianResident: [this.formValue.form_d.decisionMaker[i].isAustrallianResident],
          isAustrallianResidentY: [this.formValue.form_d.decisionMaker[i].isAustrallianResidentY],
          isAustrallianResidentN: [this.formValue.form_d.decisionMaker[i].isAustrallianResidentN],
          isForeignResident: [this.formValue.form_d.decisionMaker[i].isForeignResident],
          isForeignResidentCountry: [this.formValue.form_d.decisionMaker[i].isForeignResidentCountry],
          isForeignResidentTIN: [this.formValue.form_d.decisionMaker[i].isForeignResidentTIN],
          isForeignTaxN: [this.formValue.form_d.decisionMaker[i].isForeignTaxN]
        })
        );
      }
    } else {

    } if (this.formValue.form_a.jointInvestor.length != 0) {
      for (let i = 0; i < this.formValue.form_a.jointInvestor.length; i++) {
        this.jointInvestor = this.f1['jointInvestor'] as FormArray;
        this.jointInvestor.push(this._fb.group({
          title: [this.formValue.form_a.jointInvestor[i].title],
          givennames: [this.formValue.form_a.jointInvestor[i].givennames],
          surname: [this.formValue.form_a.jointInvestor[i].surname],
          dob: [this.formValue.form_a.jointInvestor[i].dob],
          email: [this.formValue.form_a.jointInvestor[i].email],
          suburb: [this.formValue.form_a.jointInvestor[i].suburb],
          state: [this.formValue.form_a.jointInvestor[i].state],
          isjointprimary: [this.formValue.form_a.jointInvestor[i].isjointprimary],
          postcode: [this.formValue.form_a.jointInvestor[i].postcode],
          taxfieldY: [this.formValue.form_a.jointInvestor[i].taxfieldY],
          taxfieldN: [this.formValue.form_a.jointInvestor[i].taxfieldN],
          isAustrallianResident: [this.formValue.form_a.jointInvestor[i].isAustrallianResident],
          isForeignTax: [this.formValue.form_a.jointInvestor[i].isForeignTax],
          foreigntaxfieldY: [this.formValue.form_a.jointInvestor[i].foreigntaxfieldY],
          foreigntaxfieldYTIN: [this.formValue.form_a.jointInvestor[i].foreigntaxfieldN],
          foreigntaxfieldN: [this.formValue.form_a.jointInvestor[i].foreigntaxfieldN],
          password: [this.formValue.form_a.jointInvestor[i].password],
          isPolitical: [this.formValue.form_a.jointInvestor[i].isPolitical],
          assests: [this.formValue.form_a.jointInvestor[i].assests],
          isgain: [this.formValue.form_a.jointInvestor[i].isgain],
          isfinancial: [this.formValue.form_a.jointInvestor[i].isfinancial],
          issuperannuation: [this.formValue.form_a.jointInvestor[i].issuperannuation],
          isbusiness: [this.formValue.form_a.jointInvestor[i].isbusiness],
          isother: [this.formValue.form_a.jointInvestor[i].isother],
          phone: [this.formValue.form_a.jointInvestor[i].phone],
          house: [this.formValue.form_a.jointInvestor[i].house],
          street: [this.formValue.form_a.jointInvestor[i].street],
          street_type: [this.formValue.form_a.jointInvestor[i].street_type],
          otherassests: [this.formValue.form_a.jointInvestor[i].otherassests],
          middlename: [this.formValue.form_a.jointInvestor[i].middlename]
        })
        );
      }
    }
    if (this.formValue.form_c.Trustee.length != 0) {
      for (let i = 0; i < this.formValue.form_c.Trustee.length; i++) {

        this.Trustee = this.f4['Trustee'] as FormArray;
        this.Trustee.push(this._fb.group({
          title: [this.formValue.form_c.Trustee[i].title],
          givennames: [this.formValue.form_c.Trustee[i].givennames],
          surname: [this.formValue.form_c.Trustee[i].surname],
          middlename: [this.formValue.form_c.Trustee[i].middlename],
          dob: [this.formValue.form_c.Trustee[i].dob],
          email: [this.formValue.form_c.Trustee[i].email],
          isprimary: [this.formValue.form_c.Trustee[i].isprimary],
          suburb: [this.formValue.form_c.Trustee[i].suburb],
          state: [this.formValue.form_c.Trustee[i].state],
          postcode: [this.formValue.form_c.Trustee[i].postcode],
          taxfieldY: [this.formValue.form_c.Trustee[i].taxfieldY],
          taxfieldN: [this.formValue.form_c.Trustee[i].taxfieldN],
          isAustrallianResident: [this.formValue.form_c.Trustee[i].isAustrallianResident],
          isForeignTax: [this.formValue.form_c.Trustee[i].isForeignTax],
          isForeignTaxCountry: [this.formValue.form_c.Trustee[i].isForeignTaxCountry],
          isForeignTaxTin: [this.formValue.form_c.Trustee[i].isForeignTaxTin],
          password: [this.formValue.form_c.Trustee[i].password],
          isPolitical: [this.formValue.form_c.Trustee[i].isPolitical],
          isForeignTaxN: [this.formValue.form_c.Trustee[i].isForeignTaxN],
          assests: [this.formValue.form_c.Trustee[i].assests],
          isgain: [this.formValue.form_c.Trustee[i].isgain],
          isfinancial: [this.formValue.form_c.Trustee[i].isfinancial],
          issuperannuation: [this.formValue.form_c.Trustee[i].issuperannuation],
          phone: [this.formValue.form_c.Trustee[i].phone],
          house: [this.formValue.form_c.Trustee[i].house],
          street: [this.formValue.form_c.Trustee[i].street],
          street_type: [this.formValue.form_c.Trustee[i].street_type],
          otherassests: [this.formValue.form_c.Trustee[i].otherassests],
          isother: [this.formValue.form_c.Trustee[i].isother],
          isbusiness: [this.formValue.form_c.Trustee[i].isbusiness]
        })
        );
      }
    }
    if (this.formValue.form_h.Director.length != 0) {
      for (let i = 0; i < this.formValue.form_h.Director.length; i++) {

        this.Director = this.f5['Director'] as FormArray;
        this.Director.push(this._fb.group({
          title: [this.formValue.form_h.Director[i].title],
          directornames: [this.formValue.form_h.Director[i].directornames],
          surname: [this.formValue.form_h.Director[i].surname],
          middlename: [this.formValue.form_h.Director[i].middlename],
          phone: [this.formValue.form_h.Director[i].phone],
          email: [this.formValue.form_h.Director[i].email],
          iscompanyprimary: [this.formValue.form_h.Director[i].iscompanyprimary]

        })
        );
      }
    }
  }
  //will upload individual option 1 image
  uploadFileAttachments() {

    for (let i = 0; i < this.atttachments.length; i++) {
      const atttachments = this.atttachments[i]
      const uploadItems: any = new FormData();
      uploadItems.append('id',4356);
      uploadItems.append('document', atttachments.rawFile);
      uploadItems.append("docs_type", 'individual_1');


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
  }
  //will upload individul option 2 images
  uploadindividualoption_2() {
    for (let i = 0; i < this.individualattachments1.length; i++) {
      const atttachments = this.individualattachments1[i]
      const uploadItems: any = new FormData();
      uploadItems.append('id', 4356);
      uploadItems.append('document', atttachments.rawFile);
      uploadItems.append("docs_type", 'individual_2');


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
  }
  //will upload individual 2 category images
  uploadindividualoption_2_1() {
    for (let i = 0; i < this.individualatttachments2.length; i++) {
      const atttachments = this.individualatttachments2[i]
      const uploadItems: any = new FormData();
      uploadItems.append('id',4356);
      uploadItems.append('document', atttachments.rawFile);
      uploadItems.append("docs_type", 'individual_2_1');


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
  }

  // will upload trust attachmenst for both regulated & un regulated
  uploadtrustfiles() {
    const atttachments = this.trustattachments
    const uploadItems: any = new FormData();
    uploadItems.append('id', this.clientNumber);
    uploadItems.append('document', atttachments[0].rawFile);
    uploadItems.append("docs_type", 'trust');


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
  //will upload company files
  uploadcompanyfiles() {
    const atttachments = this.companyattachments
    const uploadItems: any = new FormData();
    uploadItems.append('id',this.clientNumber);
    uploadItems.append('document', atttachments[0].rawFile);
    uploadItems.append("docs_type", 'company');


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
  uploadDeclarationSign1() {
    const atttachments = this.declarationsign1
    const uploadItems: any = new FormData();
    uploadItems.append('id', 23);
    uploadItems.append('document', atttachments[0].rawFile);
    uploadItems.append("docs_type", 'signatue1');


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
  uploadDeclarationSign2() {
    const atttachments = this.declarationsign2
    const uploadItems: any = new FormData();
    uploadItems.append('id', 23);
    uploadItems.append('document', atttachments[0].rawFile);
    uploadItems.append("docs_type", 'signatue2');


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


  selectionChange(event: StepperSelectionEvent) {



    let stepLabel = event.selectedStep.label
    if (stepLabel == "Declaration" && this.clientIdForm.get('client_type').value == "Individual") {

      if (!this.showTaxFieldY) {
        this.pushDeclaration("Individual")
      }

      this.clientDeclarationAttachments = this.f3['clientDeclarationAttachments'] as FormArray;
      this.f3?.clientDeclarationAttachments['controls'][0]?.controls?.signature_1_name?.setValue(this.clientFormA.get('givennames').value + " " + (this.clientFormA.get('middlename').value != null ? this.clientFormA.get('middlename').value : ' ')  + " " + this.clientFormA.get('surname').value)
      this.f3?.clientDeclarationAttachments['controls'][0]?.controls?.signature_1_title?.setValue(this.clientFormA.get('title').value)
      this.f3?.clientDeclarationAttachments['controls'][0]?.controls?.signature_1_date?.setValue(new Date().toDateString())


      for (let i = 0; i < this.clientFormA.get('jointInvestor').value.length; i++) {

        this.f3.clientDeclarationAttachments['controls'][i + 1]?.controls?.signature_1_name?.setValue(this.f1?.jointInvestor['controls'][i].controls.givennames.value + " " + (this.f1?.jointInvestor['controls'][i].controls.middlename.value != null ? this.f1?.jointInvestor['controls'][i].controls.middlename.value : ' ' )+ " " +this.f1?.jointInvestor['controls'][i].controls.surname.value)
        this.f3.clientDeclarationAttachments['controls'][i + 1]?.controls?.signature_1_title?.setValue(this.f1?.jointInvestor['controls'][i].controls.title.value)

        this.f3.clientDeclarationAttachments['controls'][i + 1]?.controls?.signature_1_date?.setValue(new Date().toDateString())
      }
    } else { }
    if (stepLabel == "Declaration" && (this.clientIdForm.get('client_type').value != "Individual" && this.clientIdForm.get('client_type').value != "Company" && this.clientIdForm.get('client_type').value != "Australian public company"
    && this.clientIdForm.get('client_type').value != "Unregulated Corporate" && this.clientIdForm.get('client_type').value != "Regulated Corporate")) {
      if (!this.showTaxFieldY) {
        this.pushDeclaration("Trust")
      }
      for (let i = 0; i < this.clientFormC.get('Trustee').value.length; i++) {

        this.f3.clientDeclarationAttachments['controls'][i]?.controls?.signature_1_name?.setValue(this.f4?.Trustee['controls'][i].controls.givennames.value + " " + (this.f4?.Trustee['controls'][i].controls.middlename.value != null ? this.f4?.Trustee['controls'][i].controls.middlename.value  : ' ' )+ " " + this.f4?.Trustee['controls'][i].controls.surname.value)
        this.f3.clientDeclarationAttachments['controls'][i]?.controls?.signature_1_title?.setValue(this.f4?.Trustee['controls'][i].controls.title.value)
        this.f3.clientDeclarationAttachments['controls'][i]?.controls?.signature_1_date?.setValue(new Date().toDateString())


      }
    }
    else { }
    if (stepLabel == "Declaration" && (this.clientIdForm.get('client_type').value == "Company" || this.clientIdForm.get('client_type').value == "Regulated Corporate" || this.clientIdForm.get('client_type').value == "Unregulated Corporate")) {
      this.clientDeclarationAttachments = this.f3['clientDeclarationAttachments'] as FormArray;

      if (!this.showTaxFieldY) {
        this.pushDeclaration('Company')
      }
      for (let i = 0; i < this.clientCompany.get('Director').value.length; i++) {

        this.f3.clientDeclarationAttachments['controls'][i]?.controls?.signature_1_name?.setValue(this.f5?.Director['controls'][i].controls.directornames.value + " " + (this.f5?.Director['controls'][i].controls.middlename.value != null ? this.f5?.Director['controls'][i].controls.middlename.value : ' ')+ " "+ this.f5?.Director['controls'][i].controls.surname.value)
        this.f3.clientDeclarationAttachments['controls'][i]?.controls?.signature_1_title?.setValue(this.f5?.Director['controls'][i].controls.title.value)
        this.f3.clientDeclarationAttachments['controls'][i].controls?.signature_1_date?.setValue(new Date().toDateString())
      }
    }
    if (stepLabel == "Declaration" && this.clientIdForm.get('client_type').value == "Australian public company") {
      this.clientDeclarationAttachments = this.f3['clientDeclarationAttachments'] as FormArray;

      if (!this.showTaxFieldY) {
        this.pushDeclaration('Company')
      }
      for (let i = 0; i < this.clientCompany.get('Director').value.length; i++) {
        this.f3.clientDeclarationAttachments['controls'][i]?.controls?.signature_1_name?.setValue(this.f5?.Director['controls'][i].controls.directornames.value + " " + (this.f5?.Director['controls'][i].controls.middlename.value != null ? this.f5?.Director['controls'][i].controls.middlename.value : ' ' )+ " " + this.f5?.Director['controls'][i].controls.surname.value)
        this.f3.clientDeclarationAttachments['controls'][i]?.controls?.signature_1_title?.setValue(this.f5?.Director['controls'][i].controls.title.value)
        this.f3.clientDeclarationAttachments['controls'][i].controls.signature_1_date.setValue(new Date().toDateString())


      }
    }

    /* if(stepLabel == "Declaration" && this.clientIdForm.get('client_type').value =="Regulated Corporate"){
      
      this.clientDeclarationAttachments = this.f3['clientDeclarationAttachments'] as FormArray;
     
        this.pushDeclaration('Trust')
      
      for (let i = 0; i < this.clientFormC.get('Trustee').value.length; i++) {
          
        this.f3.clientDeclarationAttachments['controls'][i]?.controls?.signature_1_name?.setValue(this.f4?.Trustee['controls'][i].controls.givennames.value +" " + this.f4?.Trustee['controls'][i].controls.surname.value)
        this.f3.clientDeclarationAttachments['controls'][i]?.controls?.signature_1_title?.setValue( this.f4?.Trustee['controls'][i].controls.title.value)
        this.f3.clientDeclarationAttachments['controls'][i]?.controls?.signature_1_date?.setValue( new Date().toLocaleDateString())
      
       
      }
    }  */
  }
  pushSign_Declaration() {

    this.individualAttachments = this.f2['individualAttachments'] as FormArray;
    this.individualAttachments.controls = []
    if (this.formValue == undefined) {

      this.individualAttachments.push(this._fb.group({

        individual: [],
        individual_1: [],
        individual_2: [],
        individual_1_doc: [],

        individual_2_categoryB_doc: [],
        individual_2_categoryA_doc: [],
        individualoption1_files: [],
        individualoption2_files: [],
        individualoption2_files_2: []

      })
      );
    } else {
      for (let i = 0; i < this.formValue.form_f.individualAttachments.length; i++) {


        this.individualAttachments.push(this._fb.group({

          individual_1: [this.formValue.form_f.individualAttachments[i].individual_1],
          individual_2: [this.formValue.form_f.individualAttachments[i].individual_2],
          individual_1_doc: [this.formValue.form_f.individualAttachments[i].individual_1_doc],
          individual: [this.formValue.form_f.individualAttachments[i].individual],
          individual_2_categoryB_doc: [this.formValue.form_f.individualAttachments[i].individual_2_categoryB_doc],
          individual_2_categoryA_doc: [this.formValue.form_f.individualAttachments[i].individual_2_categoryA_doc],
          individualoption1_files: [this.formValue.form_f.individualAttachments[i].individualoption1_files],
          individualoption2_files: [this.formValue.form_f.individualAttachments[i].individualoption2_files],
          individualoption2_files_2: [this.formValue.form_f.individualAttachments[i].individualoption2_files_2]

        })
        );
      }

    }

  }
  pushOnchangeAttachments() {

    this.individualAttachments = this.f2['individualAttachments'] as FormArray;
    this.individualAttachments.controls = []
    this.individualAttachments.push(this._fb.group({

      individual: [],
      individual_1: [],
      individual_2: [],
      individual_1_doc: [],

      individual_2_categoryB_doc: [],
      individual_2_categoryA_doc: [],
      individualoption1_files: [],
      individualoption2_files: [],
      individualoption2_files_2: []

    })
    );

  }
  private isAustrallianResidentChange(): void {

    this.clientFormA.get('isAustrallianResident').valueChanges.subscribe(value => {
      const taxFieldControlY = this.clientFormA.get('taxfieldY');
      const taxFieldControlN = this.clientFormA.get('taxfieldN');
      const validators = [Validators.required];

      if (value == 'Y') {
        taxFieldControlY.setValidators(validators);
      } else {
        taxFieldControlY.clearValidators();
      }
      if (value == 'N') {
        this.clientFormA.get('isForeignTax').setValidators(validators)
        this.clientFormA.get('isForeignTax').valueChanges.subscribe(value => {

          const foreignControlY = this.clientFormA.get('foreigntaxfieldCountry');
          const foreignControlN = this.clientFormA.get('foreigntaxfieldTin');
          const foreigntaxfieldResidency = this.clientFormA.get('foreigntaxfieldResidency');
          const validators = [Validators.required];

          if (value == 'Y') {
            foreignControlY.setValidators(validators);
            foreignControlN.setValidators(validators);
          } else {
            foreignControlY.clearValidators();
            foreignControlN.clearValidators();
          }
          if (value == 'N') {
            foreigntaxfieldResidency.setValidators(validators);

          } else {
            foreigntaxfieldResidency.clearValidators();

          }
          foreignControlY.updateValueAndValidity();
          foreignControlN.updateValueAndValidity();
          foreigntaxfieldResidency.updateValueAndValidity();
        })
      } else {
        this.clientFormA.get('isForeignTax').setValidators(null)
        this.clientFormA.get('foreigntaxfieldResidency').setValidators(null)
        this.clientFormA.get('foreigntaxfieldCountry').setValidators(null)
        this.clientFormA.get('foreigntaxfieldTin').setValidators(null)
      }

      taxFieldControlY.updateValueAndValidity();
      taxFieldControlN.updateValueAndValidity();
    });


  }
  checkIndividualValidation() {


    this.individualAttachments = this.f3['individualAttachments'] as FormArray;
    this.clientDeclarationAttachments.controls.forEach((control, index) => {
      if (control.value.signaturefilename == null) {
        this.clientDeclaration.setErrors({ 'invalid': true });
        return
      }
    });

  }




  showSignature(value) {
    saveAs(value, 'signature.png');
  }



  pushDeclaration(type) {

    this.showTaxFieldY = true

    if (this.formValue != undefined) {
      if (this.formValue?.form_g?.clientDeclarationAttachments?.length == undefined && this.clientIdForm.get('client_type').value != "Unregulated") {
        this.clientDeclarationAttachments = this.f3['clientDeclarationAttachments'] as FormArray;
        this.clientDeclarationAttachments.controls = []

        this.clientDeclarationAttachments.push(this._fb.group({

          signature_1_name: [this.formValue?.form_a?.givennames + " " + (this.formValue?.form_a?.middlename !=null ? this.formValue?.form_a?.middlename : ' ') + " " + this.formValue?.form_a?.surname],
          signature_1_date: [new Date().toDateString()],
          signature_1_title: [this.formValue?.form_a?.title],
          signaturefilename: [],
          designation: []
        })
        );

      } else if (type == 'Trust') {

        this.clientDeclarationAttachments = this.f3['clientDeclarationAttachments'] as FormArray;
        this.clientDeclarationAttachments.controls = []
        for (let i = 0; i < this.clientFormC.get('Trustee').value.length; i++) {

          this.clientDeclarationAttachments.push(this._fb.group({

            signature_1_name: [],
            signature_1_date: [new Date().toDateString()],
            signature_1_title: [],
            signaturefilename: [this.canEdit ? this.formValue?.form_g?.clientDeclarationAttachments[i]?.signaturefilename : null],
           
            designation: [this.formValue?.form_g?.clientDeclarationAttachments[i]?.designation]
          })
          );

        }
      }
      else if (type == 'Individual') {

        var a = this.clientFormA.get('jointInvestor').value.length
        this.clientDeclarationAttachments = this.f3['clientDeclarationAttachments'] as FormArray;
        this.clientDeclarationAttachments.controls = []
        for (let i = 0; i < a + 1; i++) {

          this.clientDeclarationAttachments.push(this._fb.group({

            signature_1_name: [],
            signature_1_date: [new Date().toDateString()],
            signature_1_title: [],
            signaturefilename: [ this.canEdit ? this.formValue?.form_g?.clientDeclarationAttachments[i]?.signaturefilename : null],
           
          })
          );
        }
      } else if (type == 'Company') {

        this.clientDeclarationAttachments = this.f3['clientDeclarationAttachments'] as FormArray;
        this.clientDeclarationAttachments.controls = []
        for (let i = 0; i < this.clientCompany.get('Director').value.length; i++) {

          this.clientDeclarationAttachments.push(this._fb.group({

            signature_1_name: [],
            signature_1_date: [new Date().toDateString()],
            signature_1_title: [],
            signaturefilename: [ this.canEdit ? this.formValue?.form_g?.clientDeclarationAttachments[i]?.signaturefilename : null],
          
            designation: [this.formValue?.form_g?.clientDeclarationAttachments[i]?.designation]
          })
          );

        }
      }
    }
    //operation to handel first time nullcases because signature does not work on first time pop up 
    else if (type === 'Individual') {
      var a = this.clientFormA.get('jointInvestor').value.length
      this.clientDeclarationAttachments = this.f3['clientDeclarationAttachments'] as FormArray;
      this.clientDeclarationAttachments.controls = []
      for (let i = 0; i < a + 1; i++) {

        this.clientDeclarationAttachments.push(this._fb.group({

          signature_1_name: [],
          signature_1_date: [],
          signature_1_title: [],
          signaturefilename: [],

        })
        );

      }
    } else if (type === 'Company') {
      /* var a= this.clientCompany.get('Director').value.length
      this.clientDeclarationAttachments = this.f3['clientDeclarationAttachments'] as FormArray;
        this.clientDeclarationAttachments.controls =[]
          for(let i = 0; i < a ; i++){
         
            this.clientDeclarationAttachments.push(this._fb.group({
              
              signature_1_name: [ ],
              signature_1_date: [ ],
              signature_1_title:[ ],
              signaturefilename:[],
              designation:[]
            })
            );
         
        } */
    }
    /* }else{
      this.f3.clientDeclarationAttachments['controls'][0].controls.signaturefilename.setValue[this.formValue.form_g.clientDeclarationAttachments[0].signaturefilename]
    }
*/
  }


  onIndividualChange(value, i) {
    this.f2?.individualAttachments.clearValidators()
    switch (value) {

      case 1:
        this.f2?.individualAttachments['controls'][i].controls.individual_1_doc.setValidators([Validators.required])
        if (this.f2?.individualAttachments['controls'][i].controls.individualoption1_files.value == '' || this.f2?.individualAttachments['controls'][i].controls.individualoption1_files.value == null) {
          this.f2?.individualAttachments['controls'][i].controls.individualoption1_files.setErrors({ 'invalid': true })
        }
        this.f2?.individualAttachments['controls'][i].controls.individual_2_categoryA_doc.setErrors(null)
        this.f2?.individualAttachments['controls'][i].controls.individual_2_categoryB_doc.setErrors(null)
        this.f2?.individualAttachments['controls'][i].controls.individualoption2_files.setErrors(null)
        this.f2?.individualAttachments['controls'][i].controls.individualoption2_files_2.setErrors(null)
        break;
      case 2:
        this.f2?.individualAttachments['controls'][i].controls.individual_2_categoryA_doc.setValidators([Validators.required])
        this.f2?.individualAttachments['controls'][i].controls.individual_2_categoryB_doc.setValidators([Validators.required])
        this.f2?.individualAttachments['controls'][i].controls.individual_1_doc.setErrors(null)
        this.f2?.individualAttachments['controls'][i].controls.individualoption1_files.setErrors(null)
        if (this.f2?.individualAttachments['controls'][i].controls.individualoption2_files.value == '' || this.f2?.individualAttachments['controls'][i].controls.individualoption2_files.value == null) {
          this.f2?.individualAttachments['controls'][i].controls.individualoption2_files.setErrors({ 'invalid': true })

        }
        if (this.f2?.individualAttachments['controls'][i].controls.individualoption2_files_2.value == '' || this.f2?.individualAttachments['controls'][i].controls.individualoption2_files_2.value == null) {
          this.f2?.individualAttachments['controls'][i].controls.individualoption2_files_2.setErrors({ 'invalid': true })

        }
        break;
    }


  }
  onTrustChange(value) {
    switch (value) {
      case 'option1':

        break;
      case 'option2':

        break
    }
  }


  removeTrustFile(e: RemoveEvent, type) {

    if (type == 'regulated') {
      this.clientIdentificationDetails.get('trust_files').setValue('')
      this.clientIdentificationDetails.get('trust_files').setErrors({ 'invalid': true })
      const index = this.trustattachments.findIndex(
        (item) => item.uid === e.files[0].uid
      );

      if (index >= 0) {
        this.trustattachments.splice(index, 1);
      }
    }
    else {
      this.clientIdentificationDetails.get('trust_files_unregulated').setValue('')
      this.clientIdentificationDetails.get('trust_files_unregulated').setErrors({ 'invalid': true })
      const index = this.trustattachments.findIndex(
        (item) => item.uid === e.files[0].uid
      );

      if (index >= 0) {
        this.trustattachments.splice(index, 1);
      }
    }
  }
  removeCompanyFile(e: RemoveEvent, type) {

    if (type == 'private') {
      this.clientIdentificationDetails.get('company_verification_domestic').setValue('')
      this.clientIdentificationDetails.get('company_verification_domestic').setErrors({ 'invalid': true })
      const index = this.companyattachments.findIndex(
        (item) => item.uid === e.files[0].uid
      );

      if (index >= 0) {
        this.companyattachments.splice(index, 1);
      }
    }
    else {
      this.clientIdentificationDetails.get('company_verification_privatedomestic').setValue('')
      this.clientIdentificationDetails.get('company_verification_privatedomestic').setErrors({ 'invalid': true })
      const index = this.companyDomesticattachments.findIndex(
        (item) => item.uid === e.files[0].uid
      );

      if (index >= 0) {
        this.companyDomesticattachments.splice(index, 1);
      }
    }
  }

  onTrustddChange(event, type) {

    //mark invalid if there is no file selected then only   
    if (type == 'regulated' && this.clientIdentificationDetails.get('trust_files').value == null) {
      this.clientIdentificationDetails.get('trust_unregulated').setErrors(null)
      this.clientIdentificationDetails.get('trust_files').setErrors({ 'invalid': true })
    } else if (type == 'unregulated' && this.clientIdentificationDetails.get('trust_files_unregulated').value == null) {
      this.clientIdentificationDetails.get('trust_regulated').setErrors(null)
      this.clientIdentificationDetails.get('trust_files_unregulated').setErrors({ 'invalid': true })
    }
  }
  onCompanyddChange(event, type) {

    //mark invalid if there is no file selected then only   
    if (type == 'private' && this.clientIdentificationDetails.get('company_verification_domestic').value == null) {
      this.clientIdentificationDetails.get('company_verification_domestic').setErrors({ 'invalid': true })
    } else if (type == 'domestic' && this.clientIdentificationDetails.get('company_verification_privatedomestic').value == null) {
      this.clientIdentificationDetails.get('company_verification_privatedomestic').setErrors({ 'invalid': true })
    } else {

    }
  }


  public patchData() {

    if (this._commonService.orderData.length > 0) {
      this.canEdit = true
      this.spinner.show()


      this.onInvestorChange(this._commonService.orderData[0].enq_form_data.investor_form_type)
      this.formValue = this._commonService.orderData[0].enq_form_data
      this.investmentType = this._commonService.orderData[0].enq_form_data.investor_form_type
      this.propertyAmount = this._commonService.orderData[0].investing_amount;
      this.propertyName = this._commonService.orderData[0].enq_prop_data.property_name
      this.formTitle = this._commonService?.orderData[0]?.enq_prop_data.prop_type == 3 ? 'Mortgage Fund ARSN(673 559 576)':'Property Fund'
      this.clientIdForm.patchValue({ 'client_type': this._commonService.orderData[0].enq_form_data.investor_form_type })

      this.clientFormA.patchValue(this.formValue.form_a);
      this.clientFormB.patchValue(this.formValue.form_b);
      this.clientFormC.patchValue(this.formValue.form_c);
      this.clientFormD.patchValue(this.formValue.form_d);
      this.clientIdentificationDetails.patchValue(this.formValue.form_f)
      this.clientGeneralDetails.patchValue(this.formValue.form_e)
      this.clientDeclaration.patchValue(this.formValue.form_g)
      this.clientCompany.patchValue(this.formValue.form_h)
      this.getFormArrayValue();
      this.pushSign_Declaration();


      this.spinner.hide()
    } else {
      //this.patchFormValue()
      this.canEdit = false
      this.propertyAmount = this._commonService.propertyData[0]?.InvestmentAmount
      this.propertyName = this._commonService.propertyData[1]?.property_name
      this.formTitle = this._commonService?.propertyData[1]?.prop_type == 3 ? 'Mortgage Fund ARSN(673 559 576)':'Property Fund'
    }
  }


  public openPDF(): void {

    switch (this.investmentType) {
      case "Individual":
        let IndividualData: any = document.getElementById('IndividualData');
        let IndividualBankData: any = document.getElementById('BankData');
        let IndividualIdentificationData: any = document.getElementById('identificationData');
        let IndividualDecData: any = document.getElementById('declarationData');
        IndividualData.append(IndividualBankData)
        IndividualData.append(IndividualIdentificationData)
        IndividualData.append(IndividualDecData)
        html2canvas(IndividualData).then((canvas) => {
          let fileWidth = 208;
          let fileHeight = (canvas.height * fileWidth) / canvas.width;
          const FILEURI = canvas.toDataURL('image/png');
          let PDF = new jsPDF('l', 'mm', 'a0');
          let position = 0;
          PDF.addImage(FILEURI, 'PNG', 0, position, canvas.width * 0.4, canvas.height * 0.2, "a", "FAST");
          PDF.save('filAPPLICATION.pdf');
        });
        break;
      case "Unregulated":
        let Trust: any = document.getElementById('trustData');
        let TrustBeneficial: any = document.getElementById('BeneficialData');
        let trustBankData: any = document.getElementById('BankData');
        let trustIdentificationData: any = document.getElementById('identificationData');
        let trustDecData: any = document.getElementById('declarationData');
        Trust.append(TrustBeneficial)
        Trust.append(trustBankData)
        Trust.append(trustIdentificationData)
        Trust.append(trustDecData)
        html2canvas(Trust).then((canvas) => {
          let fileWidth = 208;
          let fileHeight = (canvas.height * fileWidth) / canvas.width;
          const FILEURI = canvas.toDataURL('image/png');
          let PDF = new jsPDF('p', 'mm', 'a0');
          let position = 0;
          PDF.addImage(FILEURI, 'PNG', 0, position, canvas.width * 0.4, canvas.height * 0.2, "a", "FAST");
          PDF.save('APPLICATION.pdf');
        });
        break;
      case "Company":
        let Company: any = document.getElementById('companyData');
        let CompanyBeneficial: any = document.getElementById('BeneficialData');
        let CompanyBankData: any = document.getElementById('BankData');
        let CompanyIdentificationData: any = document.getElementById('identificationData');
        let CompanyDecData: any = document.getElementById('declarationData');

        Company.append(CompanyBeneficial)
        Company.append(CompanyBankData)
        Company.append(CompanyIdentificationData)
        Company.append(CompanyDecData)
        html2canvas(Company).then((canvas) => {
          /*  let fileWidth = 208;
           let fileHeight = (canvas.height * fileWidth) / canvas.width;
           const FILEURI = canvas.toDataURL('image/png');
           let PDF = new jsPDF('p', 'mm', 'a0');
           let position = 0;
           PDF.addImage(FILEURI, 'PNG', 0, position,canvas.width*0.4,canvas.height*0.2,"a","FAST");
           PDF.save('APPLICATION.pdf'); */
          var imgData = canvas.toDataURL('image/png');
          var imgWidth = 210;
          var pageHeight = 295;
          var imgHeight = canvas.height * imgWidth / canvas.width;
          var heightLeft = imgHeight;
          // window.jsPDF = window.jspdf.jsPDF;
          var doc = new jsPDF('p', 'mm');
          var position = 0;

          doc.addImage(imgData, 'jpeg', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'jpeg', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
          doc.save('file.pdf');
        });


        break;
      case "Regulated":



        let Regulated: any = document.getElementById('IndividualData');
        let RegulatedBeneficial: any = document.getElementById('BeneficialData');
        let RegulatedBankData: any = document.getElementById('BankData');
        let RegulatedIdentificationData: any = document.getElementById('identificationData');
        let RegulatedDecData: any = document.getElementById('declarationData');

        Regulated.append(RegulatedBeneficial)
        Regulated.append(RegulatedBankData)
        Regulated.append(RegulatedIdentificationData)
        Regulated.append(RegulatedDecData)

        html2canvas(Regulated).then((canvas) => {
          let fileWidth = 208;
          let fileHeight = (canvas.height * fileWidth) / canvas.width;
          const FILEURI = canvas.toDataURL('image/png');
          let PDF = new jsPDF('landscape', 'mm', 'a0');
          let position = 0;
          PDF.addImage(FILEURI, 'PNG', 0, position, canvas.width * 0.4, canvas.height * 0.2, "a", "FAST");
          PDF.save('APPLICATION.pdf');
        });
        break;
    }


  }




  //to set form value to null on dd change
  clientFormAAustrallia(option) {

    if (option == "Y") {
      this.clientFormA.get('isForeignTax').setValidators(null)
      this.clientFormA.get('foreigntaxfieldCountry').setErrors(null);
      this.clientFormA.get('foreigntaxfieldTin').setErrors(null);
      this.clientFormA.get('foreigntaxfieldResidency').setErrors(null);
      //this.clientFormA.get('taxfieldY').setErrors({ 'invalid': true })
    } else {
      this.clientFormA.get('taxfieldY').setValidators(null)
      // this.clientFormA.get('isForeignTax').setErrors({ 'invalid': true })
      // this.clientFormA.get('foreigntaxfieldCountry').setErrors({ 'invalid': true })
      // this.clientFormA.get('foreigntaxfieldTin').setErrors({ 'invalid': true })
      //   this.clientFormA.get('foreigntaxfieldResidency').setErrors({ 'invalid': true })
    }
  }
  //to set form value to null on dd change
  clientFormATrader(option) {

    if (option == "N") {

      this.clientFormA.get('soleTraderbusiness').setErrors(null);
      this.clientFormA.get('soleTraderhouse').setErrors(null);
      this.clientFormA.get('soleTraderstreet').setErrors(null);
      this.clientFormA.get('soleTraderstreet_type').setErrors(null);
      this.clientFormA.get('soleTradersuburb').setErrors(null);
      this.clientFormA.get('soleTraderstate').setErrors(null);
      this.clientFormA.get('soleTraderpostcode').setErrors(null);
      this.clientFormA.get('soleTraderABN').setErrors(null)
    } else {

    }
  }
  // set fprm value for foreign change
  clientFormAForeign(option) {

    if (option == "Y") {
      this.clientFormA.get('foreigntaxfieldResidency').setErrors(null)
      this.clientFormA.get('foreigntaxfieldCountry').setErrors({ 'invalid': true })
      this.clientFormA.get('foreigntaxfieldTin').setErrors({ 'invalid': true })
    } else {
      this.clientFormA.get('foreigntaxfieldResidency').setErrors({ 'invalid': true })
      this.clientFormA.get('foreigntaxfieldCountry').setErrors(null)
      this.clientFormA.get('foreigntaxfieldTin').setErrors(null)
    }
  }

  checkLength1(e) {

    const keyValue = +e;
    if (keyValue.toString().length > 6) {
      this.clientGeneralDetails.get('BSB').setErrors({ 'invalid': true })
    }
    // const numberOnlyPattern = '[0-9]+';
    // const newValue = input.value + (isNaN(keyValue) ? '' : keyValue.toString());
    // const match = newValue.match(numberOnlyPattern);

    // if (+newValue > 12 || !match || newValue === '') {
    //   e.preventDefault();
    // }
  }
  public primaryIndex: any
  isprimarychange(key, i) {

    if (key == 'Y') {
      this.primaryIndex = i
      this.showprimary = false
    } else {
      this.primaryIndex = undefined
      this.showprimary = true
    }
  }

  //create accunt of joint holder for individual form
  createjointholders(value) {

    var clients = []
    for (let i = 0; i < value.jointInvestor.length; i++) {
      clients.push({
        "full_name": value.jointInvestor[i].givennames + " " + value.jointInvestor[i].surname,
        "password": Math.random().toString(36).slice(-8),
        "client_email": value.jointInvestor[i].email,
        "contact_no": value.jointInvestor[i].phone
      })

    }
   
    const body = {
      clients
    }
    this._commonService.createJointholder(body).subscribe((res: any) => {



    },
      Error => {
        this.spinner.hide()
        alert('Something went wrong!');
      }
    )
  }
  //navigate to previuos page
  navigate(){
    this.location.back()
  }
  //changes status of form error of joint holder
  onjointholderTaxChange(value,i){
       if(value == 'Y'){
        this.f1?.jointInvestor['controls'][i ].controls.foreigntaxfieldY.setValidators([Validators.required])
        this.f1?.jointInvestor['controls'][i ].controls.foreigntaxfieldYTIN.setValidators([Validators.required])
        this.f1?.jointInvestor['controls'][i ].controls.foreigntaxfieldN.setErrors(null)
       }
       else{
        this.f1?.jointInvestor['controls'][i ].controls.foreigntaxfieldN.setValidators([Validators.required])
        this.f1?.jointInvestor['controls'][i ].controls.foreigntaxfieldY.setErrors(null)
        this.f1?.jointInvestor['controls'][i ].controls.foreigntaxfieldYTIN.setErrors(null)
       }
  }
  

  generateqrvalue(i){
 
  
    const url = 'https://client.wellkins.com.au/app-identification?uid=' +  this.clientNumber + '&name='
    
    return  url + this.f3?.clientDeclarationAttachments['controls'][i]?.controls?.signature_1_name?.value
  }

  getuploadedsignature(i:number){
    this.spinner.show()
    var body ={
      "signiture": {
          "signiture": this.clientNumber + this.f3?.clientDeclarationAttachments['controls'][i]?.controls?.signature_1_name?.value
      }
    
  }
    this._commonService.getdigitalsignature(body).subscribe((res:any)=>{
      if(res){
        this.spinner.hide()
        
        this.f3?.clientDeclarationAttachments['controls'][i]?.controls?.signaturefilename?.patchValue(res.get_Sign.digital_sign.buffer.sid)
        alert("Sucess");
        
       
      }
    },(error: any) => {
      this.spinner.hide()
      alert("Something went wrong")
    })
  }
  qrCodeScanned: boolean[] = [];

  onQRCodeScanned(event: any, index: number) {
    console.log(index)
      // Assuming you handle the scanned data here if needed
      this.qrCodeScanned[index] = true; // Set the corresponding index to true to indicate QR code scanning
  }
}

