import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { allMemes } from 'src/app/mocks/memes';
import { of } from 'rxjs';

import { ApiServiceService } from './api-service.service';

describe('ApiServiceService', () => {
  let service: ApiServiceService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new ApiServiceService(httpClientSpy);
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('obtiene memes', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(of(allMemes));
    service.obtenerMemes().subscribe({
      next: (response) => {
        expect(response).toEqual(allMemes);
        expect(httpClientSpy.get.calls.count()).toBe(1);
        expect(httpClientSpy.get.calls.first().args[0]).toBe('https://api.imgflip.com/get_memes');
        done();
      },
    });
  })
});
