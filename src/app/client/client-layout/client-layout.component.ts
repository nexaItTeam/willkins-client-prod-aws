
import { Component, ViewEncapsulation } from '@angular/core';
import { DrawerItem, DrawerItemExpandedFn, DrawerSelectEvent } from '@progress/kendo-angular-layout';
import { SVGIcon, menuIcon } from '@progress/kendo-svg-icons';

import { items } from './items';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
interface Item {text: string, svgIcon: SVGIcon, path: string, selected?: boolean}
@Component({
  selector: 'app-client-layout',
  templateUrl: './client-layout.component.html',
  styleUrls: ['./client-layout.component.css']
})
export class ClientLayoutComponent {
  public client_type :any
  public client_name :string
  public client_image: string
  public checked = true;
  public expanded = false;
  public selected = 'Inbox';
  public menuSvg: SVGIcon = menuIcon;
  public expandedIndices = [2];
constructor( private router:Router,public _authService:AuthService, private _dialog: MatDialog,){
  //this.items = this.mapItems(router.config as Item[]);
 this.client_type= sessionStorage.getItem('client_type')
 this.client_name = sessionStorage.getItem('client_name')
 debugger
 if(sessionStorage.getItem('client_image') != 'null'){
 this.client_image = 'https://wellkinsstorageprod.blob.core.windows.net/document/'+ sessionStorage.getItem('client_id')+ sessionStorage.getItem('client_image')
 }
 else{
  this.client_image ='https://www.w3schools.com/howto/img_avatar.png'
 }
}
  public isItemExpanded: DrawerItemExpandedFn = (item): boolean => {
      return this.expandedIndices.indexOf(item.id) >= 0;
  };

  public items: Array<DrawerItem> = items;

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
  public mapItems(routes: Item[]): Item[] {
    return routes.map(item => {
        return {
            text: item.text,
            svgIcon: item.svgIcon,
            path: item.path ? item.path : ''
        };
    });
}
onLogout(){
  
  this.router.navigate(['login'])
 this._authService.currentUserSubject.next(null)
  sessionStorage.clear()
}
onswitchAccount(){
    
  const data={
    title:"Switch Account",
    subtitle:'Are you sure you want to  switch account to broker ?',
  }
  const dialogRef = this._dialog.open(ConfirmationDialogComponent,{
    width:'50%',
    data:data ?data :null
  });
  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
      if(sessionStorage.getItem('client_type') =='2'){
        this.router.navigate(['/broker/dashboard'])
      }
      }else{
        this.checked = true
      }
    },
  });
}
navigate(){
  this.router.navigate(['client/clientDetails'])
}
}
