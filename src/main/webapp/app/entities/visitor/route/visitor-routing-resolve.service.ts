import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVisitor } from '../visitor.model';
import { VisitorService } from '../service/visitor.service';

@Injectable({ providedIn: 'root' })
export class VisitorRoutingResolveService implements Resolve<IVisitor | null> {
  constructor(protected service: VisitorService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVisitor | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((visitor: HttpResponse<IVisitor>) => {
          if (visitor.body) {
            return of(visitor.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
