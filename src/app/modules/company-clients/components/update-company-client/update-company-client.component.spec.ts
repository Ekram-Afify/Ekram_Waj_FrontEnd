import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCompanyClientComponent } from './update-company-client.component';

describe('UpdateCompanyClientComponent', () => {
  let component: UpdateCompanyClientComponent;
  let fixture: ComponentFixture<UpdateCompanyClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCompanyClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCompanyClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
