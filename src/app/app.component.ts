import { Component } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { BnNgIdleService } from 'bn-ng-idle'; 
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'welkins_capital_client';
  currentUser :any
  constructor(
    private bnIdle: BnNgIdleService,
    private authenticationService: AuthService,
    private router:Router,
    private route:ActivatedRoute
  ){
    
}
  
  ngOnInit(): void {
    //60 = 1 minute
   
   
    this.bnIdle.startWatching(900).subscribe((res) => {
      if (res) {
        this.authenticationService.currentUserSubject.next(null)
        sessionStorage.clear()
        
        this.router.navigate(['login'])
       alert('Due to inactivity,kindly login')
      }
    });
  
  }
 
}
