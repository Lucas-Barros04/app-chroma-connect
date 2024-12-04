import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchPage } from './search.page';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from 'src/app/models/user.models';

// Mock Services
class MockFirebaseService {
  getUsersByUsername = jasmine.createSpy('getUsersByUsername').and.returnValue(of([{ 
    uid: '123', 
    email: 'mock@example.com', 
    password: 'password', 
    name: 'Mock User', 
    username: 'mockUser', 
    phone: '1234567890', 
    photoProfile: 'url/to/photo'
  }])); 
}

class MockUtilidadesService {
  loading = jasmine.createSpy('loading').and.returnValue({
    present: jasmine.createSpy('present'),
    dismiss: jasmine.createSpy('dismiss'),
  });
}

describe('SearchPage', () => {
  let component: SearchPage;
  let fixture: ComponentFixture<SearchPage>;
  let firebaseService: MockFirebaseService;
  let utilService: MockUtilidadesService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    firebaseService = new MockFirebaseService();
    utilService = new MockUtilidadesService();
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [SearchPage],
      providers: [
        { provide: FirebaseService, useValue: firebaseService },
        { provide: UtilidadesService, useValue: utilService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the SearchPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should clear users when search text is empty', () => {
    component.searchText = '';
    component.searchUsers({ target: { value: '' } });

    expect(component.users).toEqual([]); // Se espera que los resultados estén vacíos
  });

  it('should update users on search', () => {
    const mockUser: User = { 
      uid: '123', 
      email: 'mock@example.com', 
      password: 'password', 
      name: 'Mock User', 
      username: 'mockUser', 
      phone: '1234567890', 
      photoProfile: 'url/to/photo'
    };
    component.searchUsers({ target: { value: 'mock' } });

    expect(firebaseService.getUsersByUsername).toHaveBeenCalledWith('mock');
    expect(component.users).toEqual([mockUser]); // Se espera que los usuarios sean actualizados
  });  
  
});


