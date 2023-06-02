import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOffice } from '../office.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../office.test-samples';

import { OfficeService } from './office.service';

const requireRestSample: IOffice = {
  ...sampleWithRequiredData,
};

describe('Office Service', () => {
  let service: OfficeService;
  let httpMock: HttpTestingController;
  let expectedResult: IOffice | IOffice[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OfficeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Office', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const office = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(office).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Office', () => {
      const office = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(office).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Office', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Office', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Office', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOfficeToCollectionIfMissing', () => {
      it('should add a Office to an empty array', () => {
        const office: IOffice = sampleWithRequiredData;
        expectedResult = service.addOfficeToCollectionIfMissing([], office);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(office);
      });

      it('should not add a Office to an array that contains it', () => {
        const office: IOffice = sampleWithRequiredData;
        const officeCollection: IOffice[] = [
          {
            ...office,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOfficeToCollectionIfMissing(officeCollection, office);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Office to an array that doesn't contain it", () => {
        const office: IOffice = sampleWithRequiredData;
        const officeCollection: IOffice[] = [sampleWithPartialData];
        expectedResult = service.addOfficeToCollectionIfMissing(officeCollection, office);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(office);
      });

      it('should add only unique Office to an array', () => {
        const officeArray: IOffice[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const officeCollection: IOffice[] = [sampleWithRequiredData];
        expectedResult = service.addOfficeToCollectionIfMissing(officeCollection, ...officeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const office: IOffice = sampleWithRequiredData;
        const office2: IOffice = sampleWithPartialData;
        expectedResult = service.addOfficeToCollectionIfMissing([], office, office2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(office);
        expect(expectedResult).toContain(office2);
      });

      it('should accept null and undefined values', () => {
        const office: IOffice = sampleWithRequiredData;
        expectedResult = service.addOfficeToCollectionIfMissing([], null, office, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(office);
      });

      it('should return initial array if no Office is added', () => {
        const officeCollection: IOffice[] = [sampleWithRequiredData];
        expectedResult = service.addOfficeToCollectionIfMissing(officeCollection, undefined, null);
        expect(expectedResult).toEqual(officeCollection);
      });
    });

    describe('compareOffice', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOffice(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOffice(entity1, entity2);
        const compareResult2 = service.compareOffice(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOffice(entity1, entity2);
        const compareResult2 = service.compareOffice(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOffice(entity1, entity2);
        const compareResult2 = service.compareOffice(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
