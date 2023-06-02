import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOffice } from '../office.model';
import { OfficeService } from '../service/office.service';

@Injectable({ providedIn: 'root' })
export class OfficeRoutingResolveService implements Resolve<IOffice | null> {
  constructor(protected service: OfficeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOffice | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((office: HttpResponse<IOffice>) => {
          if (office.body) {
            return of(office.body);
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
