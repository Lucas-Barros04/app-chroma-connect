import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiMemesComponent } from './api-memes.component';
import { ApiServiceService } from '../../../api-service.service';
import { of } from 'rxjs';

// Mock Service
class MockApiServiceService {
  obtenerMemes = jasmine.createSpy('obtenerMemes').and.returnValue(of({
    data: {
      memes: [
        { id: 1, name: 'Meme 1' },
        { id: 2, name: 'Meme 2' }
      ]
    }
  }));
}

describe('ApiMemesComponent', () => {
  let component: ApiMemesComponent;
  let fixture: ComponentFixture<ApiMemesComponent>;
  let apiMeme: MockApiServiceService;

  beforeEach(async () => {
    apiMeme = new MockApiServiceService();

    await TestBed.configureTestingModule({
      declarations: [ ApiMemesComponent ],
      providers: [
        { provide: ApiServiceService, useValue: apiMeme }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiMemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should use localStorage data if memes are available', () => {
    const mockMemes = JSON.stringify([
      { id: 1, name: 'Meme 1' },
      { id: 2, name: 'Meme 2' }
    ]);
    localStorage.setItem('memes', mockMemes);
    
    component.ngOnInit();
    
    expect(component.memes).toEqual(JSON.parse(mockMemes));
    expect(apiMeme.obtenerMemes).not.toHaveBeenCalled(); // No debe llamar a la API
  });

  it('should fetch memes from API if not in localStorage', () => {
    localStorage.removeItem('memes'); // Eliminar memes del localStorage
    
    component.ngOnInit();
    
    expect(apiMeme.obtenerMemes).toHaveBeenCalled(); // Debe llamar a la API
    expect(component.memes).toEqual([
      { id: 1, name: 'Meme 1' },
      { id: 2, name: 'Meme 2' }
    ]); // Se espera que los memes se asignen correctamente
    expect(localStorage.getItem('memes')).toBeTruthy(); // Los memes deben guardarse en localStorage
  });

});

