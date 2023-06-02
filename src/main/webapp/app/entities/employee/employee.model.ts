import { IOffice } from 'app/entities/office/office.model';

export interface IEmployee {
  id: number;
  name?: string | null;
  pin?: number | null;
  email?: string | null;
  phone?: number | null;
  office?: Pick<IOffice, 'id'> | null;
}

export type NewEmployee = Omit<IEmployee, 'id'> & { id: null };
