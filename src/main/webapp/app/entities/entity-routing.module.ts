import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'office',
        data: { pageTitle: 'jhipsterSampleApplicationApp.office.home.title' },
        loadChildren: () => import('./office/office.module').then(m => m.OfficeModule),
      },
      {
        path: 'employee',
        data: { pageTitle: 'jhipsterSampleApplicationApp.employee.home.title' },
        loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
      },
      {
        path: 'visitor',
        data: { pageTitle: 'jhipsterSampleApplicationApp.visitor.home.title' },
        loadChildren: () => import('./visitor/visitor.module').then(m => m.VisitorModule),
      },
      {
        path: 'visit',
        data: { pageTitle: 'jhipsterSampleApplicationApp.visit.home.title' },
        loadChildren: () => import('./visit/visit.module').then(m => m.VisitModule),
      },
      {
        path: 'attendance',
        data: { pageTitle: 'jhipsterSampleApplicationApp.attendance.home.title' },
        loadChildren: () => import('./attendance/attendance.module').then(m => m.AttendanceModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
