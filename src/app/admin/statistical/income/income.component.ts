import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { getISOWeek } from 'date-fns';
import { ApplicationConfig } from '@angular/platform-browser';
import { PrimeNGConfig } from 'primeng/api';
import {
  StatisticIncome,
  StatisticIncomeService,
} from './statistic-income.service';
export interface DataReport {
  label: string;
  dt_online: number;
  dt_store: number;
}
@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
})
export class IncomeComponent implements OnInit {
  stackedData: any;
  mode = 'year';
  date!: Date;
  dataReport: StatisticIncome[] = [];
  stackedOptions: any;

  constructor(private statisticIncomeService: StatisticIncomeService) {}
  onChange(result: Date): void {
    console.log('onChange: ', result);
    switch (this.mode) {
      case 'date':
        // Starting Monday not Sunday
        let dates: Date[] = [];
        result.setDate(result.getDate() - result.getDay() + 1);
        for (var i = 0; i < 7; i++) {
          dates.push(new Date(result));
          result.setDate(result.getDate() + 1);
        }
        let week = getISOWeek(result);
        console.log('week ', week);
        console.log('dates ', dates);
        break;
      case 'year':
        this.getStatisticIncomeByMonth(this.date.getFullYear());
        break;
      case 'month':
        console.log(result.getMonth());
        break;
    }
  }
  ngOnInit() {
    this.getStatisticIncomeByMonth(new Date().getFullYear());

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
    console.log(this.stackedData);
  }

  getStatisticIncomeByMonth(year: number) {
    this.dataReport = [];
    this.stackedData = {};
    this.statisticIncomeService
      .getStatisticIncomeByYear(year)
      .subscribe((res: StatisticIncome[]) => {
        if (res.length) {
          console.log(res);

          let statisticIncomes = res;
          let j = 0;
          for (let i = 1; i < 13; i++) {
            if (j < res.length && statisticIncomes[j].thang == i) {
              this.dataReport.push(statisticIncomes[j]);
              j++;
            } else {
              this.dataReport.push({ thang: i, dt_store: 0, dt_online: 0 });
            }
          }
          this.stackedData = {
            labels: this.dataReport.map((data) => 'Tháng ' + data.thang),
            datasets: [
              {
                type: 'bar',
                label: 'DT Cửa hàng',
                backgroundColor: '#42A5F5',
                data: this.dataReport.map((data) => data.dt_store),
              },
              {
                type: 'bar',
                label: 'DT Online',
                backgroundColor: '#FFA726',
                data: this.dataReport.map((data) => data.dt_online),
              },
            ],
          };
        }
      });
  }
}
