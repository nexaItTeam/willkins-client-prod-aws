import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BuyProjectComponent } from '../buy-project/buy-project.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  public property: any

  public userType: string
  public propertyImage: any



  constructor(
    // public appPreference: AppPreference,
    private _dialog: MatDialog,
    private _commonService: CommonService,
    public spinner: NgxSpinnerService,
    public route: Router,
    private router: ActivatedRoute
  ) {
    const getUserType = this.router.data

    getUserType.subscribe(translatedValue => {
      this.userType = translatedValue.type;
    });
  }


  ngOnInit(): void {
    this.getPropertyImage()
    this.getPropertyLists();


  }

  getPropertyLists() {

    this.spinner.show()
    this._commonService.getPropertyList().subscribe({
      next: (res: any) => {


        this.property = res.getAll.rows;
        this.property.sort((a: any, b: any) => {

          if (a.status == "Trending") return -1;

          if (a.status == "Upcoming" && b.status != "Trending") return -1;
          if (a.status == "Closed" && b.status != "Upcoming" && b.status != 'Trending') return -1;


          return 0;
        });


        this.spinner.hide()
      },
      error: console.log,

    });
  }
  onbuyNowClick(data: any) {
    const dialogRef = this._dialog.open(BuyProjectComponent, { data });
    dialogRef.afterClosed().subscribe({
      next: (val: any) => {
        if (val) {

        }
      },
    });
  }
  onpropertyClick(data: any) {


    this.route.navigate(['view-current-project', { queryParams: data.id }])
  }
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
  onFavClick(item) {
    this.spinner.show()
    let body = {
      "favourite": {
        "user_id": sessionStorage.getItem('id'),
        "prop_id": item.id

      }
    }

    var result = this._commonService
      .addFavouriteProject(body)
      .subscribe({
        next: (val: any) => {
          this.spinner.hide()
          if (val.message == 'created') {
            alert('Property added to your Wishlist')
          } else {
            alert(val.message)
          }


        },
        error: (err: any) => {
          this.spinner.hide()
          alert('Something went wrong!');
        },
      })
  }

}
