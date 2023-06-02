import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { VisitorFormService, VisitorFormGroup } from './visitor-form.service';
import { IVisitor } from '../visitor.model';
import { VisitorService } from '../service/visitor.service';

@Component({
  selector: 'jhi-visitor-update',
  templateUrl: './visitor-update.component.html',
})
export class VisitorUpdateComponent implements OnInit {
  isSaving = false;
  visitor: IVisitor | null = null;

  editForm: VisitorFormGroup = this.visitorFormService.createVisitorFormGroup();

  constructor(
    protected visitorService: VisitorService,
    protected visitorFormService: VisitorFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ visitor }) => {
      this.visitor = visitor;
      if (visitor) {
        this.updateForm(visitor);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const visitor = this.visitorFormService.getVisitor(this.editForm);
    if (visitor.id !== null) {
      this.subscribeToSaveResponse(this.visitorService.update(visitor));
    } else {
      this.subscribeToSaveResponse(this.visitorService.create(visitor));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVisitor>>): void {
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

  protected updateForm(visitor: IVisitor): void {
    this.visitor = visitor;
    this.visitorFormService.resetForm(this.editForm, visitor);
  }
}
