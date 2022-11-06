import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilToastComponent } from './util-toast.component';

describe('UtilToastComponent', () => {
  let component: UtilToastComponent;
  let fixture: ComponentFixture<UtilToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtilToastComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
