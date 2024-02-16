import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ClientLayoutComponent } from './client-layout/client-layout.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DemoComponent } from './demo/demo.component';
import { RouterModule } from '@angular/router';
import { items } from 'src/app/client/client-layout/items';
import { ClientFormComponent } from './client-form/client-form.component';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions, MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { MaterialModule } from '../material.module';
import { UploadsModule } from "@progress/kendo-angular-upload";
import { PDFExportModule } from "@progress/kendo-angular-pdf-export";
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { LoaderComponent } from './loader/loader.component';
import { BuyProjectComponent } from './buy-project/buy-project.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from "@angular/forms";
import { OrderComponent } from './order/order.component'
import { IconsModule } from "@progress/kendo-angular-icons";
import { ChartsModule } from "@progress/kendo-angular-charts";
import { GaugesModule } from '@progress/kendo-angular-gauges';
import { InvoiceComponent } from './invoice/invoice.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { VotingComponent } from './voting/voting.component';
import { SettingsComponent } from './settings/settings.component';
import { HistoryComponent } from './history/history.component';
import { UnitCertificateComponent } from './unit-certificate/unit-certificate.component';
import {
  GridModule,
  PDFModule,
  ExcelModule,
} from "@progress/kendo-angular-grid";
import { ClientTransactionComponent } from './client-transaction/client-transaction.component';
import { ViewPropInvestmentComponent } from './view-prop-investment/view-prop-investment.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';
import { PrintFormComponent } from './print-form/print-form.component';
import { BarcodesModule } from '@progress/kendo-angular-barcodes';
import { WebsocketServiceService } from '../shared/websocket-service.service';

@NgModule({
  declarations: [
    ClientLayoutComponent,
    DemoComponent,
    ClientFormComponent,
    DashboardComponent,
    ProjectComponent,
    LoaderComponent,
    BuyProjectComponent,
    OrderComponent,
    InvoiceComponent,
    ChangePasswordComponent,
    WishlistComponent,
    VotingComponent,
    SettingsComponent,
    HistoryComponent,
    UnitCertificateComponent,
    ClientTransactionComponent,
    ViewPropInvestmentComponent,
    ClientDetailComponent,
    PrintFormComponent,

  ],
  imports: [
    CommonModule,
    IconsModule,
    LayoutModule,
    ButtonsModule,
    MaterialModule,
    RouterModule.forRoot(items),
    ReactiveFormsModule,
    UploadsModule,
    InputsModule,
    PDFExportModule,
    NgxSpinnerModule,
    FormsModule,
    GaugesModule,
    ChartsModule,
    GridModule,
    PDFModule,
    ExcelModule,
    BarcodesModule,
  ],
  providers: [
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'check' } as MatCheckboxDefaultOptions },
    CurrencyPipe ,
    WebsocketServiceService
  ]
})
export class ClientModule { }
