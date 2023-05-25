import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import data from './data.json';
import { SerialPort } from 'serialport';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'temperature-and-humidity-control';
  first = 0;
  rows = 10;

  public basicData: any;
  public basicOptions: any;
  public tableData: any[] = data;
  public tableDataGraphics: any[] = data;
  public parametros: any;
  public limites: any;
  public formParametros: FormGroup;
  public formLimites: FormGroup;
  public temperatura: any = 0;
  public humedad: any = 0;

  constructor(private httpClient: HttpClient, private fb: FormBuilder) {
    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };
    this.refreshData();
    this.getParameters();
    this.getLimites();
    this.formParametros = this.fb.group({
      tmpCorreccion: [null, Validators.required],
      hmdCorreccion: [null, Validators.required],
    });
    this.formLimites = this.fb.group({
      minTemp: [null, Validators.required],
      maxTemp: [null, Validators.required],
      minHum: [null, Validators.required],
      maxHum: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    setInterval(() => {
      this.refreshData();
      this.getParameters();
      this.getLimites();
    }, 5000);
  }

  public updateGraphicData(): void {
    let labels = [
      this.tableData[200].fecha.toString().split('T')[1],
      this.tableData[180].fecha.toString().split('T')[1],
      this.tableData[160].fecha.toString().split('T')[1],
      this.tableData[140].fecha.toString().split('T')[1],
      this.tableData[120].fecha.toString().split('T')[1],
      this.tableData[100].fecha.toString().split('T')[1],
      this.tableData[80].fecha.toString().split('T')[1],
      this.tableData[60].fecha.toString().split('T')[1],
      this.tableData[40].fecha.toString().split('T')[1],
      this.tableData[20].fecha.toString().split('T')[1],
      this.tableData[0].fecha.toString().split('T')[1],
    ];
    let dataTemperatura = [
      this.tableData[200].temperaturA_REAL,
      this.tableData[180].temperaturA_REAL,
      this.tableData[160].temperaturA_REAL,
      this.tableData[140].temperaturA_REAL,
      this.tableData[120].temperaturA_REAL,
      this.tableData[100].temperaturA_REAL,
      this.tableData[80].temperaturA_REAL,
      this.tableData[60].temperaturA_REAL,
      this.tableData[40].temperaturA_REAL,
      this.tableData[20].temperaturA_REAL,
      this.tableData[0].temperaturA_REAL,
    ];

    let dataHumedad = [
      this.tableData[200].humedaD_REAL,
      this.tableData[180].humedaD_REAL,
      this.tableData[160].humedaD_REAL,
      this.tableData[140].humedaD_REAL,
      this.tableData[120].humedaD_REAL,
      this.tableData[100].humedaD_REAL,
      this.tableData[80].humedaD_REAL,
      this.tableData[60].humedaD_REAL,
      this.tableData[40].humedaD_REAL,
      this.tableData[20].humedaD_REAL,
      this.tableData[0].humedaD_REAL,
    ];
    this.basicData = {
      labels,
      datasets: [
        {
          label: 'Temperatura',
          data: dataTemperatura,
          fill: false,
          borderColor: '#FFA726',
          tension: 0.4,
        },
        {
          label: 'Humedad',
          data: dataHumedad,
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4,
        },
      ],
    };
  }

  public refreshData(): void {
    this.httpClient
      .get('https://proyecto-pif-arq.azurewebsites.net/api/getSenses')
      .subscribe(
        (response: any) => {
          console.log(response);
          this.tableData = response;
          this.tableData = this.tableData.sort();
          this.temperatura = this.tableData[0].temperaturA_REAL;
          this.humedad = this.tableData[0].humedaD_REAL;
          this.updateGraphicData();
        },
        (error) => {
          this.tableData = data;
          this.updateGraphicData();
        }
      );
  }

  public getParameters(): void {
    this.httpClient
      .get('https://proyecto-pif-arq.azurewebsites.net/api/getParameters')
      .subscribe(
        (response: any) => {
          console.log(response);
          this.parametros = response;
        },
        (error) => {}
      );
  }
  public getLimites(): void {
    this.httpClient
      .get('https://proyecto-pif-arq.azurewebsites.net/api/getLimites')
      .subscribe(
        (response: any) => {
          console.log(response);
          this.limites = response;
        },
        (error) => {}
      );
  }

  public guardarCorreccion() {
    const body: any = {
      nuevoValorTemp: this.formParametros?.get('tmpCorreccion')?.value,
      nuevoValorHumedad: this.formParametros?.get('hmdCorreccion')?.value,
    };
    this.httpClient
      .post('https://proyecto-pif-arq.azurewebsites.net/api/calibrar', body)
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response?.resultado) {
            this.getParameters();
            this.formParametros.reset();
          }
        },
        (error) => {}
      );
  }

  public guardarLimites() {
    const body: any = {
      tempLimitMin: this.formLimites?.get('minTemp')?.value,
      tempLimitMax: this.formLimites?.get('maxTemp')?.value,
      hmdLimitMin: this.formLimites?.get('minHum')?.value,
      hmdLimitMax: this.formLimites?.get('maxHum')?.value,
    };
    this.httpClient
      .post(
        'https://proyecto-pif-arq.azurewebsites.net/api/updateLimites',
        body
      )
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response?.resultado) {
            this.getLimites();
            this.formLimites.reset();
          }
        },
        (error) => {}
      );
  }
}
