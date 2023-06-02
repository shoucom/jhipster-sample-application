import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OfficeFormService } from './office-form.service';
import { OfficeService } from '../service/office.service';
import { IOffice } from '../office.model';

import { OfficeUpdateComponent } from './office-update.component';

describe('Office Management Update Component', () => {
  let comp: OfficeUpdateComponent;
  let fixture: ComponentFixture<OfficeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let officeFormService: OfficeFormService;
  let officeService: OfficeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OfficeUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(OfficeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OfficeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    officeFormService = TestBed.inject(OfficeFormService);
    officeService = TestBed.inject(OfficeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const office: IOffice = { id: 456 };

      activatedRoute.data = of({ office });
      comp.ngOnInit();

      expect(comp.office).toEqual(office);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffice>>();
      const office = { id: 123 };
      jest.spyOn(officeFormService, 'getOffice').mockReturnValue(office);
      jest.spyOn(officeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ office });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: office }));
      saveSubject.complete();

      // THEN
      expect(officeFormService.getOffice).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(officeService.update).toHaveBeenCalledWith(expect.objectContaining(office));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffice>>();
      const office = { id: 123 };
      jest.spyOn(officeFormService, 'getOffice').mockReturnValue({ id: null });
      jest.spyOn(officeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ office: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: office }));
      saveSubject.complete();

      // THEN
      expect(officeFormService.getOffice).toHaveBeenCalled();
      expect(officeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffice>>();
      const office = { id: 123 };
      jest.spyOn(officeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ office });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(officeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
