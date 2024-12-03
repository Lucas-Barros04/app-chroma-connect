import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set isPassword to true when type is password', () => {
    // Configura el tipo a 'password'
    component.type = 'password';

    // Llama al ngOnInit manualmente
    component.ngOnInit();

    // Verifica que isPassword sea true cuando type es 'password'
    expect(component.isPassword).toBe(true);
  });

  it('should not set isPassword to true if type is not password', () => {
    // Configura el tipo a otro valor
    component.type = 'text';

    // Llama al ngOnInit manualmente
    component.ngOnInit();

    // Verifica que isPassword no se establezca en true si type no es 'password'
    expect(component.isPassword).toBeUndefined();
  });

  it('should toggle hide and change type to password when hide is true', () => {
    // Configura valores iniciales
    component.hide = true;
    component.type = 'text';

    // Llama a showOrHidePassword()
    component.showOrHidePassword();

    // Verifica que hide se haya invertido
    expect(component.hide).toBe(false);
    // Verifica que type cambió a 'password'
    expect(component.type).toBe('password');
  });

  it('should toggle hide and change type to text when hide is false', () => {
    // Configura valores iniciales
    component.hide = false;
    component.type = 'password';

    // Llama a showOrHidePassword()
    component.showOrHidePassword();

    // Verifica que hide se haya invertido
    expect(component.hide).toBe(true);
    // Verifica que type cambió a 'text'
    expect(component.type).toBe('text');
  });
});






