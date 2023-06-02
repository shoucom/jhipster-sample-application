import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VisitorService } from '../service/visitor.service';

import { VisitorComponent } from './visitor.component';

describe('Visitor Management Component', () => {
  let comp: VisitorComponent;
  let fixture: ComponentFixture<VisitorComponent>;
  let service: VisitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'visitor', component: VisitorComponent }]), HttpClientTestingModule],
      declarations: [VisitorComponent],
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
      .overrideTemplate(VisitorComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VisitorComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VisitorService);

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
    expect(comp.visitors?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to visitorService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getVisitorIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getVisitorIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
