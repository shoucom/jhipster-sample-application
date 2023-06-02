import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OfficeDetailComponent } from './office-detail.component';

describe('Office Management Detail Component', () => {
  let comp: OfficeDetailComponent;
  let fixture: ComponentFixture<OfficeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfficeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ office: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OfficeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OfficeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load office on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.office).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
