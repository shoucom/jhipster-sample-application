import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOffice } from '../office.model';

@Component({
  selector: 'jhi-office-detail',
  templateUrl: './office-detail.component.html',
})
export class OfficeDetailComponent implements OnInit {
  office: IOffice | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ office }) => {
      this.office = office;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
