import { Component } from '@angular/core';
import { SeriesLabelsContentArgs } from '@progress/kendo-angular-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  public data = [
    {
      kind: "Hydroelectric",
      share: 0.175,
    },
    {
      kind: "Nuclear",
      share: 0.238,
    },
    {
      kind: "Coal",
      share: 0.118,
    },
    {
      kind: "Solar",
      share: 0.052,
    },
    {
      kind: "Wind",
      share: 0.225,
    },
    {
      kind: "Other",
      share: 0.192,
    },
  ];
  public labelContent(e: SeriesLabelsContentArgs): string {
    return e.category;
  }
  public value = 80;

  public colors = [
      {
          to: 25,
          color: '#0058e9'
      },
      {
          from: 25,
          to: 50,
          color: '#37b400'
      },
      {
          from: 50,
          to: 75,
          color: '#ffc000'
      },
      {
          from: 75,
          color: '#f31700'
      }
  ];
}
