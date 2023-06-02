import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VisitFormService } from './visit-form.service';
import { VisitService } from '../service/visit.service';
import { IVisit } from '../visit.model';
import { IVisitor } from 'app/entities/visitor/visitor.model';
import { VisitorService } from 'app/entities/visitor/service/visitor.service';
import { IOffice } from 'app/entities/office/office.model';
import { OfficeService } from 'app/entities/office/service/office.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';

import { VisitUpdateComponent } from './visit-update.component';

describe('Visit Management Update Component', () => {
  let comp: VisitUpdateComponent;
  let fixture: ComponentFixture<VisitUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let visitFormService: VisitFormService;
  let visitService: VisitService;
  let visitorService: VisitorService;
  let officeService: OfficeService;
  let employeeService: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VisitUpdateComponent],
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
      .overrideTemplate(VisitUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VisitUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    visitFormService = TestBed.inject(VisitFormService);
    visitService = TestBed.inject(VisitService);
    visitorService = TestBed.inject(VisitorService);
    officeService = TestBed.inject(OfficeService);
    employeeService = TestBed.inject(EmployeeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Visitor query and add missing value', () => {
      const visit: IVisit = { id: 456 };
      const visitor: IVisitor = { id: 15680 };
      visit.visitor = visitor;

      const visitorCollection: IVisitor[] = [{ id: 50834 }];
      jest.spyOn(visitorService, 'query').mockReturnValue(of(new HttpResponse({ body: visitorCollection })));
      const additionalVisitors = [visitor];
      const expectedCollection: IVisitor[] = [...additionalVisitors, ...visitorCollection];
      jest.spyOn(visitorService, 'addVisitorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ visit });
      comp.ngOnInit();

      expect(visitorService.query).toHaveBeenCalled();
      expect(visitorService.addVisitorToCollectionIfMissing).toHaveBeenCalledWith(
        visitorCollection,
        ...additionalVisitors.map(expect.objectContaining)
      );
      expect(comp.visitorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Office query and add missing value', () => {
      const visit: IVisit = { id: 456 };
      const office: IOffice = { id: 4500 };
      visit.office = office;

      const officeCollection: IOffice[] = [{ id: 32713 }];
      jest.spyOn(officeService, 'query').mockReturnValue(of(new HttpResponse({ body: officeCollection })));
      const additionalOffices = [office];
      const expectedCollection: IOffice[] = [...additionalOffices, ...officeCollection];
      jest.spyOn(officeService, 'addOfficeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ visit });
      comp.ngOnInit();

      expect(officeService.query).toHaveBeenCalled();
      expect(officeService.addOfficeToCollectionIfMissing).toHaveBeenCalledWith(
        officeCollection,
        ...additionalOffices.map(expect.objectContaining)
      );
      expect(comp.officesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Employee query and add missing value', () => {
      const visit: IVisit = { id: 456 };
      const host: IEmployee = { id: 65164 };
      visit.host = host;

      const employeeCollection: IEmployee[] = [{ id: 26730 }];
      jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const additionalEmployees = [host];
      const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
      jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ visit });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(
        employeeCollection,
        ...additionalEmployees.map(expect.objectContaining)
      );
      expect(comp.employeesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const visit: IVisit = { id: 456 };
      const visitor: IVisitor = { id: 95828 };
      visit.visitor = visitor;
      const office: IOffice = { id: 65146 };
      visit.office = office;
      const host: IEmployee = { id: 96345 };
      visit.host = host;

      activatedRoute.data = of({ visit });
      comp.ngOnInit();

      expect(comp.visitorsSharedCollection).toContain(visitor);
      expect(comp.officesSharedCollection).toContain(office);
      expect(comp.employeesSharedCollection).toContain(host);
      expect(comp.visit).toEqual(visit);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVisit>>();
      const visit = { id: 123 };
      jest.spyOn(visitFormService, 'getVisit').mockReturnValue(visit);
      jest.spyOn(visitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ visit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: visit }));
      saveSubject.complete();

      // THEN
      expect(visitFormService.getVisit).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(visitService.update).toHaveBeenCalledWith(expect.objectContaining(visit));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVisit>>();
      const visit = { id: 123 };
      jest.spyOn(visitFormService, 'getVisit').mockReturnValue({ id: null });
      jest.spyOn(visitService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ visit: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: visit }));
      saveSubject.complete();

      // THEN
      expect(visitFormService.getVisit).toHaveBeenCalled();
      expect(visitService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVisit>>();
      const visit = { id: 123 };
      jest.spyOn(visitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ visit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(visitService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareVisitor', () => {
      it('Should forward to visitorService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(visitorService, 'compareVisitor');
        comp.compareVisitor(entity, entity2);
        expect(visitorService.compareVisitor).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareOffice', () => {
      it('Should forward to officeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(officeService, 'compareOffice');
        comp.compareOffice(entity, entity2);
        expect(officeService.compareOffice).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareEmployee', () => {
      it('Should forward to employeeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(employeeService, 'compareEmployee');
        comp.compareEmployee(entity, entity2);
        expect(employeeService.compareEmployee).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
