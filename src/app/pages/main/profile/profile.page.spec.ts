import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import { AddPhotoComponent } from '../../sign-in/shared/add-photo/add-photo.component';
import { Photos } from 'src/app/models/photos.models';

// Mock Services
class MockFirebaseService {
  getCollectionData = jasmine.createSpy('getCollectionData').and.returnValue({
    subscribe: jasmine.createSpy('subscribe'),
  });
  signOut = jasmine.createSpy('signOut');
  uploadImg = jasmine.createSpy('uploadImg').and.returnValue(Promise.resolve('mockUrl'));
  updateDocument = jasmine.createSpy('updateDocument').and.returnValue(Promise.resolve());
  deleteDocument = jasmine.createSpy('deleteDocument').and.returnValue(Promise.resolve());
  getFilePath = jasmine.createSpy('getFilePath').and.returnValue(Promise.resolve('mockPath'));
  deleteFile = jasmine.createSpy('deleteFile').and.returnValue(Promise.resolve());
}

class MockUtilidadesService {
  presentModal = jasmine.createSpy('presentModal').and.returnValue(Promise.resolve(true));
  presentToast = jasmine.createSpy('presentToast');
  loading = jasmine.createSpy('loading').and.returnValue({
    present: jasmine.createSpy('present'),
    dismiss: jasmine.createSpy('dismiss'),
  });
  takePicture = jasmine.createSpy('takePicture').and.returnValue(Promise.resolve({ dataUrl: 'mockImageBase64' }));
  presentAlert = jasmine.createSpy('presentAlert');
  getLocalStorage = jasmine.createSpy('getLocalStorage').and.returnValue({
    uid: 'mockUid',
    username: 'mockUser',
    name: 'Mock Name',
    photoProfile: 'mockPhotoUrl',
  });
}

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let firebaseService: MockFirebaseService;
  let utilidadesService: MockUtilidadesService;

  beforeEach(async () => {
    firebaseService = new MockFirebaseService();
    utilidadesService = new MockUtilidadesService();

    await TestBed.configureTestingModule({
      declarations: [ProfilePage],
      providers: [
        { provide: FirebaseService, useValue: firebaseService },
        { provide: UtilidadesService, useValue: utilidadesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user details on pathUser call', () => {
    component.pathUser();
    expect(component.nombreUsuario).toBe('mockUser');
    expect(component.nombreApellido).toBe('Mock Name');
    expect(component.photoProfile).toBe('mockPhotoUrl');
  });

  it('should call signOut and clear user details', () => {
    component.signOut();
    expect(component.nombreUsuario).toBe('');
    expect(component.nombreApellido).toBe('');
    expect(component.photoProfile).toBe('');
    expect(firebaseService.signOut).toHaveBeenCalled();
  });

  it('should call presentModal to upload photo', async () => {
    await component.uploadPhotos();
    expect(utilidadesService.presentModal).toHaveBeenCalledWith({
      component: AddPhotoComponent,
    });
    expect(utilidadesService.presentModal).toHaveBeenCalled();
  });

  it('should call functions on ionViewWillEnter()', () => {
    spyOn(component, 'getGaleryPhotos');
    spyOn(component, 'pathFollower');
    spyOn(component, 'pathFollowin');
    spyOn(component, 'pathUser');

    component.ionViewWillEnter();

    expect(component.getGaleryPhotos).toHaveBeenCalled();
    expect(component.pathFollower).toHaveBeenCalled();
    expect(component.pathFollowin).toHaveBeenCalled();
    expect(component.pathUser).toHaveBeenCalled();
  });


  it('should upload a profile photo successfully', async () => {
    await component.updateProfilePhoto();
    expect(firebaseService.uploadImg).toHaveBeenCalledWith('users/mockUid/profilePhoto.jpg', 'mockImageBase64');
    expect(firebaseService.updateDocument).toHaveBeenCalledWith('users/mockUid', { photoProfile: 'mockUrl' });
    expect(utilidadesService.presentToast).toHaveBeenCalledWith('Foto de perfil actualizada con éxito.', 'success', 'checkmark-circle-outline');
    expect(component.photoProfile).toBe('mockUrl');
  });

  it('should delete a photo successfully', async () => {
    const mockPhoto = { id: 'photoId', imagen: 'mockImageUrl' } as any;
    component.photos = [mockPhoto];

    await component.deletePhoto(mockPhoto);

    expect(firebaseService.getFilePath).toHaveBeenCalledWith('mockImageUrl');
    expect(firebaseService.deleteFile).toHaveBeenCalledWith('mockPath');
    expect(firebaseService.deleteDocument).toHaveBeenCalledWith('users/mockUid/galery/photoId');
    expect(component.photos).toEqual([]);
    expect(utilidadesService.presentToast).toHaveBeenCalledWith('Se borro el post con existo', 'success', 'check-circle-outline');
  });
});
