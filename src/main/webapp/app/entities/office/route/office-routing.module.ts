import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OfficeComponent } from '../list/office.component';
import { OfficeDetailComponent } from '../detail/office-detail.component';
import { OfficeUpdateComponent } from '../update/office-update.component';
import { OfficeRoutingResolveService } from './office-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const officeRoute: Routes = [
  {
    path: '',
    component: OfficeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OfficeDetailComponent,
    resolve: {
      office: OfficeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OfficeUpdateComponent,
    resolve: {
      office: OfficeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OfficeUpdateComponent,
    resolve: {
      office: OfficeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(officeRoute)],
  exports: [RouterModule],
})
export class OfficeRoutingModule {}
