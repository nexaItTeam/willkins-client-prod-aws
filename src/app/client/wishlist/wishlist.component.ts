import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/shared/common.service';
import { BuyProjectComponent } from '../buy-project/buy-project.component';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {
  public property: any


  public propertyImage:any

  constructor(  
    private _dialog: MatDialog,
     private _commonService: CommonService,
     public spinner:NgxSpinnerService,
    
   ) { }

   ngOnInit(): void {
    this.getPropertyImage()
    this.getPropertyLists();
  
  
  }


  getPropertyLists() {
   
    this.spinner.show()
    let body={
      "user_id": sessionStorage.getItem('id')
  }
    this._commonService.getFavouriteList(body).subscribe({
      next: (res: any) => {
       
       
        this.property = res.getAllFavourites.rows;
         this.property.sort((a:any,b:any) => {
         
         if (a.status == "Trending" ) return -1;
       
         if(a.status == "Upcoming" && b.status !="Trending") return -1;
         if(a.status == "Closed" && b.status !="Upcoming" && b.status !='Trending') return -1;
       

          return 0;
      }); 
      
      
        this.spinner.hide()
      },
      error: (err: any) => {
        this.spinner.hide()
        alert('Something went wrong!');
      },
     
    });
  }
 
  public getPropertyImage(){
    let body = {
      "prop_id": null
  }
 

var result =   this._commonService
.getPropertyImage(body)
.subscribe({
  next: (val: any) => {
   
   
    this.propertyImage=val.data
  },
  error: (err: any) => {
    alert('Something went wrong!');
  },
});

} 

onRemoveClick(item){
  this.spinner.show()
  const body ={
    'id': item.id
  }
  var result =   this._commonService
.deleteFavouriteProject(body)
.subscribe({
next: (val: any) => {
 this.spinner.hide()
 alert('Deleted')
 this.getPropertyLists()
},
error: (err: any) => {
  this.spinner.hide()
  alert('Something went wrong!');
},
})
}
onbuyNowClick(data: any) {
  const dialogRef = this._dialog.open(BuyProjectComponent,{data});
  dialogRef.afterClosed().subscribe({
    next: (val: any) => {
      if (val) {

      }
    },
  });
}
}
