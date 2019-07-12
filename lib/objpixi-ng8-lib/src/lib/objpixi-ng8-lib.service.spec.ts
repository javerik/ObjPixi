import { TestBed } from '@angular/core/testing';

import { ObjpixiNg8LibService } from './objpixi-ng8-lib.service';

describe('ObjpixiNg8LibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObjpixiNg8LibService = TestBed.get(ObjpixiNg8LibService);
    expect(service).toBeTruthy();
  });
});
