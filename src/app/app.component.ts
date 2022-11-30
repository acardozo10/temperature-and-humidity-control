import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import data from './data.json';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'temperature-and-humedity-control';
  first = 0;
  rows = 10;

  public basicData: any;
  public basicOptions: any;
  public tableData: any[] = data;

  constructor(private httpClient: HttpClient) {
    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };
    this.refreshData();
  }

  public updateGraphicData(): void {
    let labels = [
      this.tableData[0].hora,
      this.tableData[20].hora,
      this.tableData[40].hora,
      this.tableData[60].hora,
      this.tableData[80].hora,
      this.tableData[100].hora,
      this.tableData[120].hora,
      this.tableData[140].hora,
      this.tableData[160].hora,
      this.tableData[180].hora,
      this.tableData[200].hora

    ]
    let dataTemperatura = [
      this.tableData[0].temperatura,
      this.tableData[20].temperatura,
      this.tableData[40].temperatura,
      this.tableData[60].temperatura,
      this.tableData[80].temperatura,
      this.tableData[100].temperatura,
      this.tableData[120].temperatura,
      this.tableData[140].temperatura,
      this.tableData[160].temperatura,
      this.tableData[180].temperatura,
      this.tableData[200].temperatura
    ];

    let dataHumedad = [
      this.tableData[0].humedad,
      this.tableData[20].humedad,
      this.tableData[40].humedad,
      this.tableData[60].humedad,
      this.tableData[80].humedad,
      this.tableData[100].humedad,
      this.tableData[120].humedad,
      this.tableData[140].humedad,
      this.tableData[160].humedad,
      this.tableData[180].humedad,
      this.tableData[200].humedad
    ];
    this.basicData = {
      labels,
      datasets: [
        {
          label: 'Temperatura',
          data: dataTemperatura,
          fill: false,
          borderColor: '#42A5F5',
          tension: .4
        },
        {
          label: 'Humedad',
          data: dataHumedad,
          fill: false,
          borderColor: '#FFA726',
          tension: .4
        }
      ]
    };
  };

  public refreshData(): void {
    this.httpClient.get('https://proyecto-pif-arq.azurewebsites.net/getSenses').subscribe((response: any) => {
      console.log(response);
      this.tableData = response;
      this.updateGraphicData();
    }, error => {
      this.tableData = data;
      this.updateGraphicData();
    });
  }
}