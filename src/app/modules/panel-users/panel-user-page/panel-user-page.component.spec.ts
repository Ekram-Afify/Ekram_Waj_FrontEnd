import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelUserPageComponent } from './panel-user-page.component';

describe('PanelUserPageComponent', () => {
  let component: PanelUserPageComponent;
  let fixture: ComponentFixture<PanelUserPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelUserPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
