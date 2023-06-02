import dayjs from 'dayjs/esm';

import { IVisit, NewVisit } from './visit.model';

export const sampleWithRequiredData: IVisit = {
  id: 31906,
};

export const sampleWithPartialData: IVisit = {
  id: 65087,
};

export const sampleWithFullData: IVisit = {
  id: 846,
  inTime: dayjs('2023-06-01T12:36'),
  outTime: dayjs('2023-06-02T03:57'),
};

export const sampleWithNewData: NewVisit = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
