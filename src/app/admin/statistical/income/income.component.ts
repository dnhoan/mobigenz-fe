import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { getISOWeek } from 'date-fns';
import { ApplicationConfig } from '@angular/platform-browser';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  stackedData: any;
  mode = 'date';


  dataReport = [
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 24000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 22000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 30000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 45000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 24000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 22000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 30000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 45000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 24000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 22000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 30000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 45000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 24000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 22000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 30000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 45000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 24000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 22000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 30000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 45000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 24000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 22000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 30000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 45000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 24000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 22000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 30000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 45000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 24000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 22000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 30000000,
    },
    {
      label: '1/1/2022',
      onlineReport: 15000000,
      storeReport: 45000000,
    },
  ];
  stackedOptions: any;

  constructor(private primengConfig: PrimeNGConfig) {}

  onChange(result: Date[]): void {
    console.log('onChange: ', result);
  }
  getWeek(result: Date[]): void {
    console.log('week: ', result.map(getISOWeek));
  }

  ngOnInit() {
    this.stackedData = {
      labels: this.dataReport.map((data) => data.label),
      datasets: [
        {
          type: 'bar',
          label: 'DT Cửa hàng',
          backgroundColor: '#42A5F5',
          data: this.dataReport.map((data) => data.storeReport),
        },
        {
          type: 'bar',
          label: 'DT Online',
          backgroundColor: '#FFA726',
          data: this.dataReport.map((data) => data.onlineReport),
        },
      ],
    };

    this.stackedOptions = {
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      responsive: true,
      scales: {
        xAxes: [
          {
            stacked: true,
          },
        ],
        yAxes: [
          {
            stacked: true,
          },
        ],
      },
    };
    this.stackedOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef',
          },
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: '#ebedef',
          },
          grid: {
            color: 'rgba(255,255,255,0.2)',
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: '#ebedef',
          },
          grid: {
            color: 'rgba(255,255,255,0.2)',
          },
        },
      },
    };
    this.stackedOptions = {
      plugins: {
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };
    this.primengConfig.ripple = true;
  }
  }


