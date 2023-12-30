import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  public isloggedin:boolean =false
  public currentUserSubject!: BehaviorSubject<any>;
    public currentUser!: Observable<any>;
 // private loggedIn = new BehaviorSubject<boolean>(sessionStorage.getItem("isLoggedIn") === "true");
  constructor() { 
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('isLoggedIn') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue() {
    return this.currentUserSubject.value;
}
  public setAcessToken(value:string){
    sessionStorage.setItem( 'token', value);
  }
  public getAcessRoken(){
    return sessionStorage.getItem( 'token');
  }
  public setRoleValue(value:string){
    sessionStorage.setItem( 'role', value);
  }
  public getRoleValue(){
    return sessionStorage.getItem('role');
  }
  public getDisplayName(value:string){
    
    sessionStorage.setItem( 'displayname', value);
  }
  public getDispalyNameValue(){
   return sessionStorage.getItem( 'displayname');
  }
 
}
