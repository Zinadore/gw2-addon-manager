import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonDisplayComponent } from './addon-display.component';

describe('AddonDisplayComponent', () => {
  let component: AddonDisplayComponent;
  let fixture: ComponentFixture<AddonDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddonDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddonDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
