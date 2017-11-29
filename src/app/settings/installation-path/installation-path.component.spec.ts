import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallationPathComponent } from './installation-path.component';

describe('InstallationPathComponent', () => {
  let component: InstallationPathComponent;
  let fixture: ComponentFixture<InstallationPathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallationPathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallationPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
