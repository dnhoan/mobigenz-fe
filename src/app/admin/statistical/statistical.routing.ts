import { Routes, RouterModule } from '@angular/router';
import { IncomeComponent } from './income/income.component';

const routes: Routes = [
  {
    path:"income",
    component: IncomeComponent
   },
];

export const StatisticalRoutes = RouterModule.forChild(routes);
