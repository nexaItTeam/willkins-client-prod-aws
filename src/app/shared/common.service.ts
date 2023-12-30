
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { RestEnds } from "../shared/config"
import { environment } from "src/environment/env"
import { Observable } from 'rxjs';
import { Login } from '../Models/login-interface';
import { RoleService } from './role.service';
interface email {
  "email": string
}
interface verifyotp {
  "id": number,
  "otp": string
}
interface changepass {
  "client": {
    "email": string,
    "password": string
  }
}
interface updatepass {
  "client": {
    "email": string,
    "old_password": string,
    "new_password": string
  }
}
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public propertyData = []
  public orderData = []
  public invoiceData = []
  constructor(
    private _roleService: RoleService,
    private _http: HttpClient
  ) { }
  getRequestHeaders(authenticate: boolean) {
    var headers: any = {
      'Accept': 'application/json'
    };
    if (authenticate) {
      // Append access token and referesh token
      // headers[ACCESS_TOKEN_KEY] = `Bearer ${this.appPreference.getAccessToken()}`;

      // if (endUrl == 'users/save' || endUrl == 'users/update') {
      headers['x-auth-token'] = this._roleService.getAcessRoken()
      // }
    }
    return {
      headers: new HttpHeaders(headers),
    };
  }
  postClientDetail(body: any) {
    const headers = this.getRequestHeaders(true);
    return this._http.post(environment.CLIENT_FORM_ENDPOINT + 'post', body, headers);
  }
  getClientDetail(body: any): Observable<any> {
    const headers = this.getRequestHeaders(true);
    return this._http.post(environment.CLIENT_FORM_ENDPOINT + 'get', body, headers);

  }
  saveClientDraft(body: any) {
    const headers = this.getRequestHeaders(true);
    return this._http.post(environment.CLIENT_FORM_ENDPOINT + 'update', body, headers);
  }
  loginUser(body: Login) {

    return this._http.post(environment.CLIENT_LOGIN + 'client-login', body);
  }
  uploadClientattachments(body: any) {
    return this._http.post(environment.CLIENT_DOC_UPLOAD, body);
  }
  getPropertyList() {
    return this._http.post(environment.PROPERTY_ENDPOINT + 'getAll', []);
  }
  addEnquiry(body: any) {
    return this._http.post(environment.ENQUIRY_ENDPOINT + 'add', body);
  }
  getPropertyImage(data: any) {
    return this._http.post(environment.PROPERTY_ENDPOINT + 'getImg', data);
  }
  getViewProperty(data: any) {
    return this._http.post(environment.PROPERTY_ENDPOINT + 'getImgById', data);
  }
  getOrderData(id) {
    const headers = this.getRequestHeaders(true);
    return this._http.post(environment.CLIENT_FORM_ENDPOINT + 'getOrder', id, headers);
  }
  sendOtp(body: email) {
    return this._http.post(environment.CLIENT_LOGIN + 'send-otp', body);
  }
  verifyOtp(body: verifyotp) {
    return this._http.post(environment.CLIENT_LOGIN + 'verify-otp', body);

  }
  changepass(body: changepass) {
    return this._http.post(environment.CLIENT_LOGIN + 'forgot-password', body);
  }
  updateDocList(body: any) {
    const headers = this.getRequestHeaders(true);
    return this._http.post(environment.USER_ENDPOINT + 'update', body, headers);
  }
  updateclientpass(body: updatepass) {
    const headers = this.getRequestHeaders(true);
    return this._http.post(environment.CLIENT_LOGIN + 'change-password', body, headers);
  }
  addFavouriteProject(body) {
    const headers = this.getRequestHeaders(true);
    return this._http.post(environment.FAV_ENDPOINT + 'addFavorite', body, headers);
  }
  getFavouriteList(body) {
    const headers = this.getRequestHeaders(true);
    return this._http.post(environment.FAV_ENDPOINT + 'getAllFavouriteList', body, headers);
  }
  deleteFavouriteProject(body) {
    const headers = this.getRequestHeaders(true);
    return this._http.post(environment.FAV_ENDPOINT + 'delete', body, headers);
  }
  sendEmailInvoice(body) {
    const headers = this.getRequestHeaders(true);
    return this._http.post(environment.CLIENT_FORM_ENDPOINT + 'invoice-email', body, headers);
  }
  //create joint holder api
  createJointholder(body) {
    const headers = this.getRequestHeaders(true);
    return this._http.post(environment.CLIENT_LOGIN + 'create-clients', body, headers);
  }
  // get client transaction
  getTransactionData(body){
    const headers = this.getRequestHeaders(true);
    return this._http.post(environment.CLIENT_FORM_ENDPOINT + 'get-transaction', body, headers);
  }
  updateEnquiryList(body: any) {
    const headers = this.getRequestHeaders(true);
    return this._http.post(environment.CLIENT_LOGIN + 'update', body, headers);
  }
  //will get particular client data in client detail page
  getClientData(body: any){
    const headers = this.getRequestHeaders(true);
    return this._http.post(environment.CLIENT_LOGIN + 'get', body, headers);
  }
 
}
