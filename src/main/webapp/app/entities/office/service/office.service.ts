import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOffice, NewOffice } from '../office.model';

export type PartialUpdateOffice = Partial<IOffice> & Pick<IOffice, 'id'>;

export type EntityResponseType = HttpResponse<IOffice>;
export type EntityArrayResponseType = HttpResponse<IOffice[]>;

@Injectable({ providedIn: 'root' })
export class OfficeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/offices');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(office: NewOffice): Observable<EntityResponseType> {
    return this.http.post<IOffice>(this.resourceUrl, office, { observe: 'response' });
  }

  update(office: IOffice): Observable<EntityResponseType> {
    return this.http.put<IOffice>(`${this.resourceUrl}/${this.getOfficeIdentifier(office)}`, office, { observe: 'response' });
  }

  partialUpdate(office: PartialUpdateOffice): Observable<EntityResponseType> {
    return this.http.patch<IOffice>(`${this.resourceUrl}/${this.getOfficeIdentifier(office)}`, office, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOffice>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOffice[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOfficeIdentifier(office: Pick<IOffice, 'id'>): number {
    return office.id;
  }

  compareOffice(o1: Pick<IOffice, 'id'> | null, o2: Pick<IOffice, 'id'> | null): boolean {
    return o1 && o2 ? this.getOfficeIdentifier(o1) === this.getOfficeIdentifier(o2) : o1 === o2;
  }

  addOfficeToCollectionIfMissing<Type extends Pick<IOffice, 'id'>>(
    officeCollection: Type[],
    ...officesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const offices: Type[] = officesToCheck.filter(isPresent);
    if (offices.length > 0) {
      const officeCollectionIdentifiers = officeCollection.map(officeItem => this.getOfficeIdentifier(officeItem)!);
      const officesToAdd = offices.filter(officeItem => {
        const officeIdentifier = this.getOfficeIdentifier(officeItem);
        if (officeCollectionIdentifiers.includes(officeIdentifier)) {
          return false;
        }
        officeCollectionIdentifiers.push(officeIdentifier);
        return true;
      });
      return [...officesToAdd, ...officeCollection];
    }
    return officeCollection;
  }
}
