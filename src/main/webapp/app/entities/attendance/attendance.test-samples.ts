import dayjs from 'dayjs/esm';

import { IAttendance, NewAttendance } from './attendance.model';

export const sampleWithRequiredData: IAttendance = {
  id: 67192,
};

export const sampleWithPartialData: IAttendance = {
  id: 61584,
  outTime: dayjs('2023-06-01T15:14'),
};

export const sampleWithFullData: IAttendance = {
  id: 38898,
  inTime: dayjs('2023-06-02T08:07'),
  outTime: dayjs('2023-06-02T04:29'),
};

export const sampleWithNewData: NewAttendance = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
