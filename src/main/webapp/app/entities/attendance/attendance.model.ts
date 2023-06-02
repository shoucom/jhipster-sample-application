import dayjs from 'dayjs/esm';
import { IEmployee } from 'app/entities/employee/employee.model';
import { IOffice } from 'app/entities/office/office.model';

export interface IAttendance {
  id: number;
  inTime?: dayjs.Dayjs | null;
  outTime?: dayjs.Dayjs | null;
  employee?: Pick<IEmployee, 'id'> | null;
  office?: Pick<IOffice, 'id'> | null;
}

export type NewAttendance = Omit<IAttendance, 'id'> & { id: null };
