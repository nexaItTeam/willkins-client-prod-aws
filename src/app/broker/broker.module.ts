import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrokerLayoutComponent } from './broker-layout/broker-layout.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IconsModule } from "@progress/kendo-angular-icons";
import { ChartsModule } from "@progress/kendo-angular-charts";
import { GaugesModule } from '@progress/kendo-angular-gauges';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { MaterialModule } from '../material.module';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

import { RouterModule } from '@angular/router';

import { brokerItems} from 'src/app/broker/broker-layout/broker-item';
import { MyClientComponent } from './my-client/my-client.component';
import { BrokerTransactionComponent } from './broker-transaction/broker-transaction.component';
import { BrokerDashboardComponent } from './broker-dashboard/broker-dashboard.component'

@NgModule({
  declarations: [
    BrokerLayoutComponent,
    MyClientComponent,
    BrokerTransactionComponent,
    BrokerDashboardComponent
  ],
  imports: [
    CommonModule,
    
    IconsModule,
    LayoutModule,
    ButtonsModule,
    MaterialModule,
    RouterModule.forRoot(brokerItems),
    ReactiveFormsModule,
    UploadsModule,
    InputsModule,
    PDFExportModule,
    NgxSpinnerModule,
    FormsModule,
    GaugesModule,
    ChartsModule
  ]
})
export class BrokerModule { }
