import { bellIcon, gearIcon, chartLineIcon, heartIcon, clockArrowRotateIcon, pencilIcon, starOutlineIcon,graphIcon,userIcon,starIcon} from "@progress/kendo-svg-icons";

import { BrokerLayoutComponent } from "./broker-layout.component";
import { LoginComponent } from "src/app/login/login.component";
import { DemoComponent } from "src/app/client/demo/demo.component";

  export const brokerItems = [
 
 {
  text: "DashBoard",
  icon: "k-i-edit",
  svgIcon: graphIcon, 
  path:"broker/dashboard",
  component:DemoComponent
},
{
  text: "Projects",
  icon: "k-i-edit",
  svgIcon: starIcon, 
  path:"broker/project",
  component:DemoComponent
},
{
  text: "My Investment",
  icon: "k-i-edit",
  svgIcon: userIcon, 
  path:"broker/order",
  component:DemoComponent
},
{
  text: "Transaction",
  icon: "k-i-edit",
  svgIcon: clockArrowRotateIcon, 
  path:"broker/transaction",
  component:DemoComponent
},

// {
//   text: "SwitchUser",
//   icon: "k-i-edit",
//   svgIcon: graphIcon, 
//   path:"broker/dashboard",
//   component:DemoComponent
// },

 /*  {
    text: "Project",
    icon: "k-i-edit",
    svgIcon: starIcon,
    path:"client/project",
  },
  
  {
    text: "My Investment",
    icon: "k-i-edit",
    svgIcon: userIcon,
    path:"client/order",
  },
  {
    text: "Wishlist",
    icon: "k-i-edit",
    svgIcon: heartIcon,
    path:"client/wishlist",
   
  },
  {
    text: "Voting",
    icon: "k-i-edit",
    svgIcon: chartLineIcon,
    path:"client/voting",
  },
  {
    text: "History",
    icon: "k-i-edit",
    svgIcon: clockArrowRotateIcon,
    path:"client/history",
  },
  {
    text: "Switch User",
    icon: "k-i-edit",
    svgIcon: userIcon,
    path:"client/switch",
  },

  {
    text: "Settings",
    icon: "k-i-edit",
    svgIcon: gearIcon,
   path:'client',
    id:1,
   
  },
  {
    text: "Change Password",
    icon: "k-i-edit",
    svgIcon: pencilIcon,
    path:"client/changePassword",
    parentId: 1,
   
  }, */
];
    
  
  