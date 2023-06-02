import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AttendanceFormService } from './attendance-form.service';
import { AttendanceService } from '../service/attendance.service';
import { IAttendance } from '../attendance.model';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { IOffice } from 'app/entities/office/office.model';
import { OfficeService } from 'app/entities/office/service/office.service';

import { AttendanceUpdateComponent } from './attendance-update.component';

describe('Attendance Management Update Component', () => {
  let comp: AttendanceUpdateComponent;
  let fixture: ComponentFixture<AttendanceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let attendanceFormService: AttendanceFormService;
  let attendanceService: AttendanceService;
  let employeeService: EmployeeService;
  let officeService: OfficeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AttendanceUpdateComponent],
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
      .overrideTemplate(AttendanceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AttendanceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    attendanceFormService = TestBed.inject(AttendanceFormService);
    attendanceService = TestBed.inject(AttendanceService);
    employeeService = TestBed.inject(EmployeeService);
    officeService = TestBed.inject(OfficeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Employee query and add missing value', () => {
      const attendance: IAttendance = { id: 456 };
      const employee: IEmployee = { id: 15728 };
      attendance.employee = employee;

      const employeeCollection: IEmployee[] = [{ id: 73880 }];
      jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const additionalEmployees = [employee];
      const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
      jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ attendance });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(
        employeeCollection,
        ...additionalEmployees.map(expect.objectContaining)
      );
      expect(comp.employeesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Office query and add missing value', () => {
      const attendance: IAttendance = { id: 456 };
      const office: IOffice = { id: 80914 };
      attendance.office = office;

      const officeCollection: IOffice[] = [{ id: 87592 }];
      jest.spyOn(officeService, 'query').mockReturnValue(of(new HttpResponse({ body: officeCollection })));
      const additionalOffices = [office];
      const expectedCollection: IOffice[] = [...additionalOffices, ...officeCollection];
      jest.spyOn(officeService, 'addOfficeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ attendance });
      comp.ngOnInit();

      expect(officeService.query).toHaveBeenCalled();
      expect(officeService.addOfficeToCollectionIfMissing).toHaveBeenCalledWith(
        officeCollection,
        ...additionalOffices.map(expect.objectContaining)
      );
      expect(comp.officesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const attendance: IAttendance = { id: 456 };
      const employee: IEmployee = { id: 43993 };
      attendance.employee = employee;
      const office: IOffice = { id: 47479 };
      attendance.office = office;

      activatedRoute.data = of({ attendance });
      comp.ngOnInit();

      expect(comp.employeesSharedCollection).toContain(employee);
      expect(comp.officesSharedCollection).toContain(office);
      expect(comp.attendance).toEqual(attendance);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttendance>>();
      const attendance = { id: 123 };
      jest.spyOn(attendanceFormService, 'getAttendance').mockReturnValue(attendance);
      jest.spyOn(attendanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attendance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attendance }));
      saveSubject.complete();

      // THEN
      expect(attendanceFormService.getAttendance).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(attendanceService.update).toHaveBeenCalledWith(expect.objectContaining(attendance));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttendance>>();
      const attendance = { id: 123 };
      jest.spyOn(attendanceFormService, 'getAttendance').mockReturnValue({ id: null });
      jest.spyOn(attendanceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attendance: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attendance }));
      saveSubject.complete();

      // THEN
      expect(attendanceFormService.getAttendance).toHaveBeenCalled();
      expect(attendanceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttendance>>();
      const attendance = { id: 123 };
      jest.spyOn(attendanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attendance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(attendanceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEmployee', () => {
      it('Should forward to employeeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(employeeService, 'compareEmployee');
        comp.compareEmployee(entity, entity2);
        expect(employeeService.compareEmployee).toHaveBeenCalledWith(entity, entity2);
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
  });
});
