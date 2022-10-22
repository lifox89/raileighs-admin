import { Component, OnInit } from '@angular/core';
import { Chart }  from 'chart.js';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  public chart: any;

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  chartBarData = {
    // labels: [...this.months].slice(0, 7),
    labels: this.months,
    datasets: [
      {
        label: 'TRD Ormoc',
        backgroundColor: '#3C5148',
        data: [1140, 2030, 12000, 3829, 17711, 4202, 7919, 12000, 3829, 17711, 4202, 7919]
      },
      {
        label: 'Raileighs Baybay',
        backgroundColor: '#8bc7ad',
        data: [2140, 10030, 13000, 5829, 18711, 31202, 17919, 10000, 13829, 12711, 41202, 41919]
      }
    ]
  };

  constructor() { }

  ngOnInit(): void {
    this.createChart();
  }

  createChart(){
    
  }

}
