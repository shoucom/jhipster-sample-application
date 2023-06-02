import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: 7813,
};

export const sampleWithPartialData: IEmployee = {
  id: 68531,
  pin: 37115,
  email: 'Tristian.Parisian@hotmail.com',
};

export const sampleWithFullData: IEmployee = {
  id: 99851,
  name: 'asymmetric Cambridgeshire',
  pin: 28480,
  email: 'Henriette.Greenholt52@hotmail.com',
  phone: 47743,
};

export const sampleWithNewData: NewEmployee = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
