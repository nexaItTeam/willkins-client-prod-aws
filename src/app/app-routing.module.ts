import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ClientLayoutComponent } from './client/client-layout/client-layout.component';
import { DemoComponent } from './client/demo/demo.component';
import {
  bellIcon,
  calendarIcon,
  circleIcon,
  envelopeLinkIcon,
  inboxIcon,
  pencilIcon,
  starOutlineIcon,
} from "@progress/kendo-svg-icons";
import { ClientFormComponent } from './client/client-form/client-form.component';
import { roleGuard } from './shared/role.guard';
import { ProjectComponent } from './client/project/project.component';
import { DashboardComponent } from './client/dashboard/dashboard.component';
import { OrderComponent } from './client/order/order.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { InvoiceComponent } from './client/invoice/invoice.component';
import { ChangePasswordComponent } from './client/change-password/change-password.component';
import { VotingComponent } from './client/voting/voting.component';
import { HistoryComponent } from './client/history/history.component';
import { WishlistComponent } from './client/wishlist/wishlist.component';
import { SettingsComponent } from './client/settings/settings.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { BrokerLayoutComponent } from './broker/broker-layout/broker-layout.component';
import { BrokerTransactionComponent } from './broker/broker-transaction/broker-transaction.component';
import { MyClientComponent } from './broker/my-client/my-client.component';
import { UnitCertificateComponent } from './client/unit-certificate/unit-certificate.component';
import { ClientTransactionComponent } from './client/client-transaction/client-transaction.component';
import { ViewPropInvestmentComponent } from './client/view-prop-investment/view-prop-investment.component';
import { ClientDetailComponent } from './client/client-detail/client-detail.component';
import { PrintFormComponent } from './client/print-form/print-form.component';



const routes: Routes = [
  {
    path: '',
   redirectTo:'login',
    pathMatch:'full'
  },
   

  {
  path: 'login',
  component: LoginComponent,
  children: []
},
{
  path: 'forgot',
  component: ForgotPasswordComponent,
  children: []
},
{
  path: 'terms',
  component: TermsConditionComponent,
  
},

{
  path: 'policy',
  component: PrivacyComponent,
},
{
  path: 'invoice',
  component: InvoiceComponent,
  children: []
},

{
  path: 'certificate',
  component: UnitCertificateComponent,
  children: []
},
{
  path: 'transaction',
  component: ClientTransactionComponent,
  children: []
},
{
  path: 'client',
  component: ClientLayoutComponent,
  canActivate: [roleGuard],
  data: { roles: ['0','2'],type:'client' },
  children: [
    {
      path: 'demo',
      component: DemoComponent,
    },
    
    {
      path: 'clientDetails',
      component: ClientDetailComponent,
    },
    {
      path: 'client-form',
      component: ClientFormComponent,

    },
    {
      path: 'dashboard',
      component: DashboardComponent,

    },
    {
      path: 'buyShare',
      component: ClientFormComponent,

    },
    {
      path: 'project',
      component: ProjectComponent,
      data: { type:'client'}
    },
    {
      path: 'order',
      component: OrderComponent,

    },
    {
      path: 'view-investment',
      component: ViewPropInvestmentComponent,

    },
    
    {
      path: 'wishlist',
      component: WishlistComponent,

    },
    {
      path: 'voting',
      component: VotingComponent,

    },
    {
      path: 'history',
      component: HistoryComponent,

    },
    {
      path: 'switch',
      component: SettingsComponent,

    },
    {
      path: 'changePassword',
      component: ChangePasswordComponent,

    },
    {
      path: 'print-application',
      component: PrintFormComponent,
      
    },

  ]
},
{
  path: 'broker',
  component: BrokerLayoutComponent,
  canActivate: [roleGuard],
  data: { roles: ['1','2'] ,type:'broker'},
  children: [
    {
      path: 'project',
      component: ProjectComponent,
      data: { type:'broker'},
    },     
    {
      path: 'dashboard',
      component: DashboardComponent
    },
    {
      path: 'changePassword',
      component: ChangePasswordComponent,
    },
    {
      path: 'transaction',
      component: BrokerTransactionComponent,
    },
    {
      path: 'investment',
      component: MyClientComponent,
    },
    {
      path: 'order',
      component: OrderComponent,
    },
    
    
  ]
},
{
  path: '**',
 redirectTo:'login',
  pathMatch:'full'
}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
