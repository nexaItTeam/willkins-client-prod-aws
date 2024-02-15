import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClientModule } from './client/client.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NgxOtpInputModule } from "ngx-otp-input";
import { BrokerModule } from './broker/broker.module';
import { BnNgIdleService } from 'bn-ng-idle';
import {ConfirmationDialogComponent} from 'src/app/confirmation-dialog/confirmation-dialog.component'
import { AppSignatureComponent } from './app-signature/app-signature.component';
import { InputsModule } from "@progress/kendo-angular-inputs";
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ConfirmationDialogComponent,
    AppSignatureComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ClientModule,
    LayoutModule,
    ButtonsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgxOtpInputModule,
    BrokerModule,
    InputsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

