import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { VisitFormService, VisitFormGroup } from './visit-form.service';
import { IVisit } from '../visit.model';
import { VisitService } from '../service/visit.service';
import { IVisitor } from 'app/entities/visitor/visitor.model';
import { VisitorService } from 'app/entities/visitor/service/visitor.service';
import { IOffice } from 'app/entities/office/office.model';
import { OfficeService } from 'app/entities/office/service/office.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';

@Component({
  selector: 'jhi-visit-update',
  templateUrl: './visit-update.component.html',
})
export class VisitUpdateComponent implements OnInit {
  isSaving = false;
  visit: IVisit | null = null;

  visitorsSharedCollection: IVisitor[] = [];
  officesSharedCollection: IOffice[] = [];
  employeesSharedCollection: IEmployee[] = [];

  editForm: VisitFormGroup = this.visitFormService.createVisitFormGroup();

  constructor(
    protected visitService: VisitService,
    protected visitFormService: VisitFormService,
    protected visitorService: VisitorService,
    protected officeService: OfficeService,
    protected employeeService: EmployeeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareVisitor = (o1: IVisitor | null, o2: IVisitor | null): boolean => this.visitorService.compareVisitor(o1, o2);

  compareOffice = (o1: IOffice | null, o2: IOffice | null): boolean => this.officeService.compareOffice(o1, o2);

  compareEmployee = (o1: IEmployee | null, o2: IEmployee | null): boolean => this.employeeService.compareEmployee(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ visit }) => {
      this.visit = visit;
      if (visit) {
        this.updateForm(visit);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const visit = this.visitFormService.getVisit(this.editForm);
    if (visit.id !== null) {
      this.subscribeToSaveResponse(this.visitService.update(visit));
    } else {
      this.subscribeToSaveResponse(this.visitService.create(visit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVisit>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(visit: IVisit): void {
    this.visit = visit;
    this.visitFormService.resetForm(this.editForm, visit);

    this.visitorsSharedCollection = this.visitorService.addVisitorToCollectionIfMissing<IVisitor>(
      this.visitorsSharedCollection,
      visit.visitor
    );
    this.officesSharedCollection = this.officeService.addOfficeToCollectionIfMissing<IOffice>(this.officesSharedCollection, visit.office);
    this.employeesSharedCollection = this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(
      this.employeesSharedCollection,
      visit.host
    );
  }

  protected loadRelationshipsOptions(): void {
    this.visitorService
      .query()
      .pipe(map((res: HttpResponse<IVisitor[]>) => res.body ?? []))
      .pipe(map((visitors: IVisitor[]) => this.visitorService.addVisitorToCollectionIfMissing<IVisitor>(visitors, this.visit?.visitor)))
      .subscribe((visitors: IVisitor[]) => (this.visitorsSharedCollection = visitors));

    this.officeService
      .query()
      .pipe(map((res: HttpResponse<IOffice[]>) => res.body ?? []))
      .pipe(map((offices: IOffice[]) => this.officeService.addOfficeToCollectionIfMissing<IOffice>(offices, this.visit?.office)))
      .subscribe((offices: IOffice[]) => (this.officesSharedCollection = offices));

    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
      .pipe(map((employees: IEmployee[]) => this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(employees, this.visit?.host)))
      .subscribe((employees: IEmployee[]) => (this.employeesSharedCollection = employees));
  }
}
