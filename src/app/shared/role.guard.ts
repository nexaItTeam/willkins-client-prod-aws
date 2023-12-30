import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import {RoleService} from 'src/app/shared/role.service'
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  
 // const authService: RoleService = inject(RoleService);
 const authService: AuthService = inject(AuthService)
  const router: Router = inject(Router);
  const  {roles} = route.data;
  //const currentUser =authService.getDispalyNameValue();
  const currentUser = authService.currentUserSubject.value;
 
  if(currentUser != null && roles.indexOf(sessionStorage.getItem('client_type')) != -1){

  return true
 }
 else{
  
  router.navigate(['/login']);
  //sessionStorage.removeItem('displayname');
return false
 } 
 
};



