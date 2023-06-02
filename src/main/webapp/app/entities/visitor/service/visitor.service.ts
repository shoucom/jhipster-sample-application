import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVisitor, NewVisitor } from '../visitor.model';

export type PartialUpdateVisitor = Partial<IVisitor> & Pick<IVisitor, 'id'>;

export type EntityResponseType = HttpResponse<IVisitor>;
export type EntityArrayResponseType = HttpResponse<IVisitor[]>;

@Injectable({ providedIn: 'root' })
export class VisitorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/visitors');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(visitor: NewVisitor): Observable<EntityResponseType> {
    return this.http.post<IVisitor>(this.resourceUrl, visitor, { observe: 'response' });
  }

  update(visitor: IVisitor): Observable<EntityResponseType> {
    return this.http.put<IVisitor>(`${this.resourceUrl}/${this.getVisitorIdentifier(visitor)}`, visitor, { observe: 'response' });
  }

  partialUpdate(visitor: PartialUpdateVisitor): Observable<EntityResponseType> {
    return this.http.patch<IVisitor>(`${this.resourceUrl}/${this.getVisitorIdentifier(visitor)}`, visitor, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVisitor>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVisitor[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVisitorIdentifier(visitor: Pick<IVisitor, 'id'>): number {
    return visitor.id;
  }

  compareVisitor(o1: Pick<IVisitor, 'id'> | null, o2: Pick<IVisitor, 'id'> | null): boolean {
    return o1 && o2 ? this.getVisitorIdentifier(o1) === this.getVisitorIdentifier(o2) : o1 === o2;
  }

  addVisitorToCollectionIfMissing<Type extends Pick<IVisitor, 'id'>>(
    visitorCollection: Type[],
    ...visitorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const visitors: Type[] = visitorsToCheck.filter(isPresent);
    if (visitors.length > 0) {
      const visitorCollectionIdentifiers = visitorCollection.map(visitorItem => this.getVisitorIdentifier(visitorItem)!);
      const visitorsToAdd = visitors.filter(visitorItem => {
        const visitorIdentifier = this.getVisitorIdentifier(visitorItem);
        if (visitorCollectionIdentifiers.includes(visitorIdentifier)) {
          return false;
        }
        visitorCollectionIdentifiers.push(visitorIdentifier);
        return true;
      });
      return [...visitorsToAdd, ...visitorCollection];
    }
    return visitorCollection;
  }
}
