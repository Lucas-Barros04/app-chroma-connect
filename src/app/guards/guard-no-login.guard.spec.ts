import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { guardNoLoginGuard } from './guard-no-login.guard';

describe('guardNoLoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => guardNoLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
