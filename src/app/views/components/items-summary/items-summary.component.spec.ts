import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsSummaryComponent } from './items-summary.component';

describe('ItemsSummaryComponent', () => {
  let component: ItemsSummaryComponent;
  let fixture: ComponentFixture<ItemsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
