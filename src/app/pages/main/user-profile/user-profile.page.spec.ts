import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfilePage } from './user-profile.page';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { of } from 'rxjs';
import { Photos } from 'src/app/models/photos.models';

describe('UserProfilePage', () => {
  let component: UserProfilePage;
  let fixture: ComponentFixture<UserProfilePage>;
  let firebaseServiceMock: any;

  beforeEach(async () => {
    firebaseServiceMock = {
      getDocument: jasmine.createSpy().and.returnValue(Promise.resolve({})),
      getCollectionData: jasmine.createSpy().and.returnValue(of([])),
      updateDocument: jasmine.createSpy().and.returnValue(Promise.resolve()),
      setDocument: jasmine.createSpy().and.returnValue(Promise.resolve()),
      deleteDocument: jasmine.createSpy().and.returnValue(Promise.resolve()),
    };

    await TestBed.configureTestingModule({
      declarations: [UserProfilePage],
      providers: [
        {
          provide: FirebaseService,
          useValue: firebaseServiceMock,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jasmine.createSpy().and.returnValue('testUserId'),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize userId and currentUserId', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ uid: 'currentUserId' }));
    component.ngOnInit();
    expect(component.userId).toBe('testUserId');
    expect(component.currentUserId).toBe('currentUserId');
  });

  it('should call getDocument for user data and gallery', async () => {
    component.ngOnInit();
    expect(firebaseServiceMock.getDocument).toHaveBeenCalledWith('users/testUserId');
    expect(firebaseServiceMock.getCollectionData).toHaveBeenCalledWith('users/testUserId/galery');
  });

  it('should toggle like status on a photo', async () => {
    const photo: Photos = {
      id: 'photoId',
      likes: 0,
      imagen: 'test-image.jpg',
      name: 'Test Photo',
      descripcion: 'A test photo',
      likedBy: [],
    };
    component.currentUserId = 'currentUserId';
  
    // Caso: Usuario da like
    await component.toggleLike(photo);
    expect(photo.likedBy).toContain('currentUserId'); // Verificar que se agregó el usuario
    expect(photo.likes).toBe(1); // Verificar que los likes incrementaron
    expect(firebaseServiceMock.updateDocument).toHaveBeenCalledWith('users/testUserId/galery/photoId', {
      likes: 1,
      likedBy: ['currentUserId'],
    });
  
    // Caso: Usuario quita el like
    await component.toggleLike(photo);
    expect(photo.likedBy).not.toContain('currentUserId'); // Verificar que se eliminó el usuario
    expect(photo.likes).toBe(0); // Verificar que los likes decrementaron
    expect(firebaseServiceMock.updateDocument).toHaveBeenCalledWith('users/testUserId/galery/photoId', {
      likes: 0,
      likedBy: [],
    });
  });
  

  it('should follow a user', async () => {
    component.currentUserId = 'currentUserId';
    await component.followUser();
    expect(firebaseServiceMock.setDocument).toHaveBeenCalledWith('users/currentUserId/following/testUserId', { followed: true });
    expect(firebaseServiceMock.setDocument).toHaveBeenCalledWith('users/testUserId/followers/currentUserId', { follower: true });
    expect(component.isFollowing).toBeTrue();
  });

  it('should unfollow a user', async () => {
    component.currentUserId = 'currentUserId';
    await component.unfollowUser();
    expect(firebaseServiceMock.deleteDocument).toHaveBeenCalledWith('users/currentUserId/following/testUserId');
    expect(firebaseServiceMock.deleteDocument).toHaveBeenCalledWith('users/testUserId/followers/currentUserId');
    expect(component.isFollowing).toBeFalse();
  });
});

