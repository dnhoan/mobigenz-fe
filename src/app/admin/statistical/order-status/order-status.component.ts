import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { StatisticIncomeService } from '../income/statistic-income.service';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss'],
})
export class OrderStatusComponent implements OnInit {
  data: any;
  date!: Date;
  chartOptions: any;
  constructor(
    private commonService: CommonService,
    private statisticIncomeService: StatisticIncomeService
  ) {}

  ngOnInit(): void {}
  onChange(event: any) {
    console.log(event);
    let s_date = formatDate(event[0], 'dd/MM/yyyy', 'en-US');
    let e_date = formatDate(event[1], 'dd/MM/yyyy', 'en-US');
    this.showDataStatistic(s_date, e_date);
  }
  showDataStatistic(s_date: string, e_date: string) {
    this.statisticIncomeService
      .statisticOrderStatus(s_date, e_date)
      .subscribe((res) => {
        if (res) {
          this.data = {
            labels: this.commonService.orderStatuses
              .sort((a, b) => a.status - b.status)
              .map((o) => o.statusName),
            datasets: [
              {
                data: res,
                backgroundColor: this.commonService.orderStatuses.map(
                  (o) => o.color
                ),
                hoverBackgroundColor: this.commonService.orderStatuses.map(
                  (o) => o.color
                ),
              },
            ],
          };
        }
      });
  }
}
