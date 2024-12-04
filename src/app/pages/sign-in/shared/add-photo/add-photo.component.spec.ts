import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AddPhotoComponent } from './add-photo.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { Photos } from 'src/app/models/photos.models';
import { User } from 'src/app/models/user.models';

describe('AddPhotoComponent', () => {
  let component: AddPhotoComponent;
  let fixture: ComponentFixture<AddPhotoComponent>;
  let firebaseServiceMock: any;
  let utilidadesServiceMock: any;

  beforeEach(async () => {
    firebaseServiceMock = {
      uploadImg: jasmine.createSpy('uploadImg').and.returnValue(Promise.resolve('uploadedImageUrl')),
      addDocument: jasmine.createSpy('addDocument').and.returnValue(Promise.resolve()),
      updateDocument: jasmine.createSpy('updateDocument').and.returnValue(Promise.resolve()),
      getFilePath: jasmine.createSpy('getFilePath').and.returnValue(Promise.resolve('filePath')),
    };

    utilidadesServiceMock = {
      getLocalStorage: jasmine.createSpy('getLocalStorage').and.returnValue({ uid: 'testUserId' }),
      loading: jasmine.createSpy('loading').and.returnValue(Promise.resolve({ present: jasmine.createSpy(), dismiss: jasmine.createSpy() })),
      presentToast: jasmine.createSpy('presentToast'),
      closeModal: jasmine.createSpy('closeModal'),
      takePicture: jasmine.createSpy('takePicture').and.returnValue(Promise.resolve({ dataUrl: 'testImageDataUrl' })),
    };

    await TestBed.configureTestingModule({
      declarations: [AddPhotoComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: FirebaseService, useValue: firebaseServiceMock },
        { provide: UtilidadesService, useValue: utilidadesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with user data from local storage', () => {
    // Simula que getLocalStorage retorna un objeto de usuario con todas las propiedades necesarias
    const mockUser: User = {
      uid: 'testUserId',
      email: 'testuser@example.com',
      password: 'password123',
      name: 'Test User',
      username: 'testuser',
      phone: '1234567890',
      photoProfile: 'url/to/photo'
    };
  
    // Simula el comportamiento de getLocalStorage
    utilidadesServiceMock.getLocalStorage.and.returnValue(mockUser);
  
    // Llama al ngOnInit para inicializar el componente
    component.ngOnInit();
  
    // Verifica que getLocalStorage fue llamado con 'user'
    expect(utilidadesServiceMock.getLocalStorage).toHaveBeenCalledWith('user');
  
    // Verifica que el componente tenga los datos correctos del usuario
    expect(component.user).toEqual(mockUser);
  });
  
  
  it('should take a photo and update form control', async () => {
    await component.takeImg();
    expect(utilidadesServiceMock.takePicture).toHaveBeenCalledWith('Fotografía');
    expect(component.form.controls.imagen.value).toEqual('testImageDataUrl');
  });

  
  it('should update a photo successfully', async () => {
    component.photo = {
      id: 'photoId',
      likes: 10,
      descripcion: 'Old Description',
      imagen: 'oldImageUrl',
      name: 'Old Name',
      likedBy: []
    };
    component.form.setValue({
      likes: 10,
      id: 'photoId',
      descripcion: 'Updated Description',
      imagen: 'testImageDataUrl',
      name: 'Updated Name',
      likedBy: []
    });

    await component.updatePhoto();

    expect(firebaseServiceMock.getFilePath).toHaveBeenCalledWith('oldImageUrl');
    expect(firebaseServiceMock.uploadImg).toHaveBeenCalledWith('filePath', 'testImageDataUrl');
    expect(firebaseServiceMock.updateDocument).toHaveBeenCalledWith('users/testUserId/galery/photoId', jasmine.any(Object));
    expect(utilidadesServiceMock.presentToast).toHaveBeenCalledWith('Se actualizo el post con existo', 'success', 'check-circle-outline');
  });
  
  it('should not submit if form is invalid', () => {
    component.form.setValue({
      likes: 0,
      id: '',
      descripcion: '',
      imagen: '',
      name: '',
      likedBy: []
    });

    component.submit();

    expect(firebaseServiceMock.addDocument).not.toHaveBeenCalled();
    expect(firebaseServiceMock.updateDocument).not.toHaveBeenCalled();
  });
});
