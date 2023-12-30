import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import {brokerItems} from './broker-item'
import { SVGIcon, menuIcon } from '@progress/kendo-svg-icons';
import { DrawerItem, DrawerItemExpandedFn, DrawerSelectEvent } from '@progress/kendo-angular-layout';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-broker-layout',
  templateUrl: './broker-layout.component.html',
  styleUrls: ['./broker-layout.component.css']
})
export class BrokerLayoutComponent {
  public checked =true
  public expanded = false;
  public selected = 'Inbox';
  public menuSvg: SVGIcon = menuIcon;
  public expandedIndices = [2];
constructor(private router:Router,public _authService:AuthService,private _dialog: MatDialog){}

public isItemExpanded: DrawerItemExpandedFn = (item): boolean => {
  return this.expandedIndices.indexOf(item.id) >= 0;
};

public items: Array<DrawerItem> = brokerItems;

public onSelect(ev: DrawerSelectEvent): void {
  this.selected = ev.item.text;
  
  const current = ev.item.id;
  this.router.navigate([ev.item.path]);
  if (this.expandedIndices.indexOf(current) >= 0) {
      this.expandedIndices = this.expandedIndices.filter((id) => id !== current);
  } else {
      this.expandedIndices.push(current);
  }
}
onLogout(){
  
  this.router.navigate(['login'])
 this._authService.currentUserSubject.next(null)
  sessionStorage.clear()
}
onswitchAccount(){
    
  const data={
    title:"Switch Account",
    subtitle:'Are you sure you want to  switch account to client ?',
  }
  const dialogRef = this._dialog.open(ConfirmationDialogComponent,{
    width:'50%',
    data:data ?data :null
  });
  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
      if(sessionStorage.getItem('client_type') =='2'){
        this.router.navigate(['/client/dashboard'])
      }
      }else{
        this.checked = true
      }
    },
  });
}
}
