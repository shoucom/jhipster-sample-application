import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OfficeComponent } from './list/office.component';
import { OfficeDetailComponent } from './detail/office-detail.component';
import { OfficeUpdateComponent } from './update/office-update.component';
import { OfficeDeleteDialogComponent } from './delete/office-delete-dialog.component';
import { OfficeRoutingModule } from './route/office-routing.module';

@NgModule({
  imports: [SharedModule, OfficeRoutingModule],
  declarations: [OfficeComponent, OfficeDetailComponent, OfficeUpdateComponent, OfficeDeleteDialogComponent],
})
export class OfficeModule {}
