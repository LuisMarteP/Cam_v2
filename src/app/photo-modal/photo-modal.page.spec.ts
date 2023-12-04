import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoModalPage } from './photo-modal.page';

describe('PhotoModalPage', () => {
  let component: PhotoModalPage;
  let fixture: ComponentFixture<PhotoModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PhotoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
