import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainPage } from './main.page';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';

// Mock Services
class MockFirebaseService {
  signOut = jasmine.createSpy('signOut');
}

class MockUtilidadesService {}

describe('MainPage', () => {
  let component: MainPage;
  let fixture: ComponentFixture<MainPage>;
  let mockFirebaseService: MockFirebaseService;

  beforeEach(async () => {
    mockFirebaseService = new MockFirebaseService();

    await TestBed.configureTestingModule({
      declarations: [MainPage],
      providers: [
        { provide: FirebaseService, useValue: mockFirebaseService },
        { provide: UtilidadesService, useClass: MockUtilidadesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call signOut on the FirebaseService when signOut is called', () => {
    component.signOut();
    expect(mockFirebaseService.signOut).toHaveBeenCalled();
  });
});

