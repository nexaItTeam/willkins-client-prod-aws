import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent {
constructor(public _authService:AuthService){
 
}
public steps = [
  { label: "Happy", emoji: "*" },
  { label: "Angry", emoji: "😠" },
  { label: "Cool", emoji: "😎" },
  { label: "Love", emoji: "😍" },
  { label: "Fear", emoji: "😨" },
];
}
