import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFillStyleComponent } from './edit-fill-style.component';

describe('EditFillStyleComponent', () => {
  let component: EditFillStyleComponent;
  let fixture: ComponentFixture<EditFillStyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFillStyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFillStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
