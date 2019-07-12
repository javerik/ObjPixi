import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjpixiNg8LibComponent } from './objpixi-ng8-lib.component';

describe('ObjpixiNg8LibComponent', () => {
  let component: ObjpixiNg8LibComponent;
  let fixture: ComponentFixture<ObjpixiNg8LibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjpixiNg8LibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjpixiNg8LibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
