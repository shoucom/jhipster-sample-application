import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OfficeService } from '../service/office.service';

import { OfficeComponent } from './office.component';

describe('Office Management Component', () => {
  let comp: OfficeComponent;
  let fixture: ComponentFixture<OfficeComponent>;
  let service: OfficeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'office', component: OfficeComponent }]), HttpClientTestingModule],
      declarations: [OfficeComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(OfficeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OfficeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OfficeService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.offices?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to officeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getOfficeIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getOfficeIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
