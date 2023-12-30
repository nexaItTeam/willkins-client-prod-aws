import { bellIcon, gearIcon, chartLineIcon, heartIcon, clockArrowRotateIcon, pencilIcon, starOutlineIcon,graphIcon,userIcon,starIcon} from "@progress/kendo-svg-icons";
import { DemoComponent } from "../demo/demo.component";
import { ClientLayoutComponent } from "./client-layout.component";
import { LoginComponent } from "src/app/login/login.component";
import { ChangePasswordComponent } from "../change-password/change-password.component";
import { WishlistComponent } from "../wishlist/wishlist.component";

  export const items = [
 
 {
  text: "DashBoard",
  icon: "k-i-edit",
  svgIcon: graphIcon, 
  path:"client/dashboard",
  component:DemoComponent
},

  {
    text: "Project",
    icon: "k-i-edit",
    svgIcon: starIcon,
    path:"client/project",
    component:DemoComponent
  },
  
  {
    text: "My Investment",
    icon: "k-i-edit",
    svgIcon: userIcon,
    path:"client/view-investment",
    component:DemoComponent
  },
  {
    text: "Wishlist",
    icon: "k-i-edit",
    svgIcon: heartIcon,
    path:"client/wishlist",
    component:WishlistComponent
  },
  {
    text: "Voting",
    icon: "k-i-edit",
    svgIcon: chartLineIcon,
    path:"client/voting",
    component:DemoComponent
  },
  {
    text: "History",
    icon: "k-i-edit",
    svgIcon: clockArrowRotateIcon,
    path:"client/history",
    component:DemoComponent
  },
  {
    text: "Switch User",
    icon: "k-i-edit",
    svgIcon: userIcon,
    path:"client/switch",
    component:DemoComponent
  },

  {
    text: "Settings",
    icon: "k-i-edit",
    svgIcon: gearIcon,
   path:'client',
    id:1,
    component: ChangePasswordComponent
  },
  {
    text: "Change Password",
    icon: "k-i-edit",
    svgIcon: pencilIcon,
    path:"client/changePassword",
    parentId: 1,
    component: ChangePasswordComponent
  },
];
    
  
  