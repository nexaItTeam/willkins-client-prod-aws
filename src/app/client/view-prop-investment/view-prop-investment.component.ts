import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/shared/common.service';
import { AggregateDescriptor, GroupDescriptor, groupBy } from '@progress/kendo-data-query';
import { Location } from '@angular/common'
@Component({
  selector: 'app-view-prop-investment',
  templateUrl: './view-prop-investment.component.html',
  styleUrls: ['./view-prop-investment.component.css']
})
export class ViewPropInvestmentComponent {
  public property:any
  public propertyImage:any
  public dataSource:any
 public aggregates: AggregateDescriptor[] = [
  { field: "investing_amount", aggregate: "sum" },
];
  public groups: GroupDescriptor[] = [{ field: "enq_prop_data.id" ,aggregates: this.aggregates}];
  constructor( private _commonService: CommonService,
    public spinner:NgxSpinnerService,
    public route:Router,private location:Location){

  }

  
  
  ngOnInit(): void {
    this.getPropertyImage()
    this.getPropertyLists();
    this.getOrderData();
  
  }
 async getPropertyLists() {
    
    this.spinner.show()
   await this._commonService.getPropertyList().subscribe({
      next: (res: any) => {
       
       
        this.property = res.getAll.rows;
      
        this.spinner.hide()
      },
      error: (err: any) => {
        this.spinner.hide()
        alert('Something went wrong!');
      },
     
    });
  }

 async  getPropertyImage(){
this.spinner.show()
    let body = {
      "prop_id": null
  }
 

var  result =  await this._commonService
.getPropertyImage(body)
.subscribe({
  next: (val: any) => {
   
   
    this.propertyImage=val.data
    this.spinner.hide()
  },
  error: (err: any) => {
    this.spinner.hide()
    alert('Something went wrong!');
  },
});

} 

public async getOrderData() {
  this.spinner.show()
  var body = {
    "client_id": sessionStorage.getItem('id')
  }
 await this._commonService.getOrderData(body).subscribe({
    next: (res: any) => {

      this.dataSource = groupBy(res.getOrder, this.groups) ;     
      
      this.spinner.hide() 
    },
    error: (err: any) => {
      alert('error from server side');
      this.spinner.hide();
    }
  });
}

onpropertyClick(item){
  
  
  const options = {queryParams: {words: [item.id,item.property_name,item.desc,item.base_price,item.facility]}};
  this.route.navigate(['/client/order'],options)

}
}
