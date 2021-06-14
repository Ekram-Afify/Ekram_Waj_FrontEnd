import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelUsersComponent } from './panel-users.component';

describe('PanelUsersComponent', () => {
  let component: PanelUsersComponent;
  let fixture: ComponentFixture<PanelUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
