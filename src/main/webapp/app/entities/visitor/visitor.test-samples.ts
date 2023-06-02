import { IVisitor, NewVisitor } from './visitor.model';

export const sampleWithRequiredData: IVisitor = {
  id: 2708,
};

export const sampleWithPartialData: IVisitor = {
  id: 6568,
  name: 'Missouri Quality-focused California',
};

export const sampleWithFullData: IVisitor = {
  id: 85127,
  name: 'Small',
  email: 'Lelah.Lesch60@gmail.com',
  phone: 10270,
};

export const sampleWithNewData: NewVisitor = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
