import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLabelStyleComponent } from './edit-label-style.component';

describe('EditLabelStyleComponent', () => {
  let component: EditLabelStyleComponent;
  let fixture: ComponentFixture<EditLabelStyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLabelStyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLabelStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
