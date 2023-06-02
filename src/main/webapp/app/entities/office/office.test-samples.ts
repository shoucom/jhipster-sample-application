import { IOffice, NewOffice } from './office.model';

export const sampleWithRequiredData: IOffice = {
  id: 80120,
};

export const sampleWithPartialData: IOffice = {
  id: 69527,
  timeZone: 'Exclusive lime Refined',
  wifiPassword: 'Soft Tennessee Focused',
};

export const sampleWithFullData: IOffice = {
  id: 80806,
  name: 'Incredible',
  address: 'payment',
  timeZone: 'Cheese Territory',
  wifiPassword: 'Clothing application',
};

export const sampleWithNewData: NewOffice = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
