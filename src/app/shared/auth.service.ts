
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environment/env';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, public router: Router, public spinner: NgxSpinnerService, private route: ActivatedRoute) {
    this.currentUserSubject = new BehaviorSubject<any>(sessionStorage.getItem('currentUser'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(body: any) {

    return this.http.post<any>(environment.CLIENT_LOGIN + "client-login", body).subscribe((res: any) => {
     
      sessionStorage.setItem('currentUser', res);
      sessionStorage.setItem('id', res.user.id);
      sessionStorage.setItem('isFirst', res.user.isFirst);
      sessionStorage.setItem('client_email', res.user.client_email)
      sessionStorage.setItem('token', res.accessToken);
      sessionStorage.setItem('client_name', res.user.full_name);
      sessionStorage.setItem('contact', res.user.contact_no);
      sessionStorage.setItem('client_type', res.user.client_type);
      sessionStorage.setItem('client_image', res.user.client_image);
      sessionStorage.setItem('client_id', res.user.client_id);
      this.currentUserSubject.next(res);

      switch (res.user.client_type) {
        case 0:
          if (!res.user.isFirst) {
            this.router.navigate(['/client/dashboard']);
          } else {

            this.router.navigate(['/client/changePassword'])
            alert('You have been logged in using your default password kindly change your password  ')
          }
          break;
        case 1:
          if (!res.user.isFirst) {
            this.router.navigate(['/broker/dashboard']);
          } else {

            this.router.navigate(['/broker/changePassword'])
            alert('You have been logged in using your default password kindly change your password  ')
          }
          break;
        case 2:
          if (!res.user.isFirst) {
            this.router.navigate(['/client/dashboard']);
          } else {

            this.router.navigate(['/client/changePassword'])
            alert('You have been logged in using your default password kindly change your password  ')
          }
          break;
      }

      this.spinner.hide()
      return this.currentUser;

    }, ((error: any) => {

      alert("Something went wrong")
      this.spinner.hide()
    }))
    // store user details and jwt token in local storage to keep user logged in between page refreshes


  }

  logout() {

    // remove user from local storage to log user out

  }
}
