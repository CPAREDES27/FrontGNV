import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { UserTypeGnv } from 'src/app/enums/user-type.enum';
import { ExpressionValidation } from 'src/app/models/expression-validation';
import { UsuarioRegistrarRequestModel } from 'src/app/models/usuario-registrar/usuario-registrar-request.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { ClienteRegisterService } from 'src/app/services/cliente-register.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-empresa-register',
  templateUrl: './empresa-register.component.html',
  styleUrls: ['./empresa-register.component.scss']
})
export class EmpresaRegisterComponent implements OnInit {
  formCreateClientBusiness : FormGroup; 
  portalGnvClient = new UsuarioRegistrarRequestModel();
  messageSucces = [];
  constructor(private formBuilder: FormBuilder,
      private authorizesService: AuthorizesService,
      private commonService: CommonService,
      private clienteRegisterService: ClienteRegisterService) { }

  ngOnInit(): void {
    this.createClientBusinessForm();
  }

  cancelarRegistroUsario(): void{
    this.authorizesService.redirectLogin(); 
  }

  createClientBusinessForm() {
    this.formCreateClientBusiness = this.formBuilder.group({
      rucBusiness: ['', [Validators.required, Validators.pattern(ExpressionValidation.Ruc), RxwebValidators.numeric({ allowDecimal: false }), Validators.minLength(11), Validators.maxLength(11)]],
      razonSocial: ['', [Validators.required, Validators.pattern(ExpressionValidation.LetterSpace)]],
      emailBusiness: ['', [Validators.required, Validators.email]],
      telefonoBusiness: ['', [Validators.pattern(ExpressionValidation.Telefono)]],
			celularBusiness: ['', [Validators.required, Validators.pattern(ExpressionValidation.Celular), Validators.minLength(9), Validators.maxLength(9)]],
      passwordBusiness: ['', [Validators.required, Validators.minLength(6), Validators.pattern(ExpressionValidation.PassWord)]],
			passConfirmBusiness: ['', [Validators.required, Validators.minLength(6)]],
      tpoliticasCondiciones: [false, [Validators.requiredTrue]],
      tpfinesComerciales: [false]  
    },{
      validators: [this.validateClientPasswordConfirmation, this.atLeastClientHomePhoneOrCellPhoneValidator]
    });
  }

  validateClientPasswordConfirmation(abstractControl: AbstractControl) {
		if (abstractControl.get('passwordBusiness').value && abstractControl.get('passConfirmBusiness').value) {
			if (abstractControl.get('passwordBusiness').value == abstractControl.get('passConfirmBusiness').value) return null;
			else return { differentPassword: true };
		} else return null;
	}

  atLeastClientHomePhoneOrCellPhoneValidator(abstractControl: AbstractControl) {
		if ((abstractControl.get('celularBusiness').value != null
				&& abstractControl.get('celularBusiness').value.toString().trim() != '')
			  ||
        (abstractControl.get('telefonoBusiness').value != null
          && abstractControl.get('telefonoBusiness').value.toString().trim() != '')) {
			  return null;
		} else return { homePhoneOrCellPhoneIsNeeded: true };
	}

  validateClientBusinessForm() {
		if (this.formCreateClientBusiness.valid) return true;
		else {
			let errors = [];
      if (this.formCreateClientBusiness.get('rucBusiness').hasError('required')) errors.push('Debe ingresar un número RUC.');
      else if (!this.formCreateClientBusiness.get('rucBusiness').valid) errors.push('Debe ingresar un número RUC válido.');

      if (this.formCreateClientBusiness.get('razonSocial').hasError('required')) errors.push('Debe ingresar su razón social.');
			else if (!this.formCreateClientBusiness.get('razonSocial').valid) errors.push('Debe ingresar una razón social válida.');
      
      if (this.formCreateClientBusiness.get('emailBusiness').hasError('required')) errors.push('Debe ingresar su correo.');
			else if (!this.formCreateClientBusiness.get('emailBusiness').valid) errors.push('Debe ingresar un correo válido.');
            
      if (this.formCreateClientBusiness.hasError('homePhoneOrCellPhoneIsNeeded')) errors.push('Debe ingresar al menos un número de teléfono o celular.');
      else if (!this.formCreateClientBusiness.get('celularBusiness').valid) errors.push('Debe ingresar un número de celular válido.');
      else if (!this.formCreateClientBusiness.get('telefonoBusiness').valid) errors.push('Debe ingresar un número de teléfono válido.');

      if (this.formCreateClientBusiness.get('passwordBusiness').hasError('required')) errors.push('Debe ingresar una contraseña.');
      else if (!this.formCreateClientBusiness.get('passwordBusiness').valid) errors.push('Debe ingresar una contraseña como mínimo 6 caracteres, un valor numérico, una mayúscula, una minúscula y al menos un símbolo (“@“, “\$”, “!”, “%”, “*”, “?”, “&”, “#”, “^”, “(“, “)”, “_”, “=“, “\\”, “[“, “{“, “]”, “}”, “;”, “:”, “<“, “>”, “|”, “.”, “/“, “,”, “-“).');
      if (this.formCreateClientBusiness.get('passConfirmBusiness').hasError('required')) errors.push('Debe confirmar la contraseña.');
      if (this.formCreateClientBusiness.get('passConfirmBusiness').valid && this.formCreateClientBusiness.hasError('differentPassword')) errors.push('Las contraseñas no coinciden.');

      if (this.formCreateClientBusiness.get('tpoliticasCondiciones').hasError('required')) errors.push('Debe aceptar los Términos y condiciones y Políticas web de privacidad del Portal Web GNV de Cálidda.');
      
      this.commonService.getErrorHtmlList(errors);
			return false;
		}
	}

  registerUserTypeBusiness() {  
		if (this.validateClientBusinessForm()) { 
      this.portalGnvClient.Ruc = this.formCreateClientBusiness.get('rucBusiness').value;
      this.portalGnvClient.RazonSocial = this.formCreateClientBusiness.get('razonSocial').value;
      this.portalGnvClient.UsuarioEmail = this.formCreateClientBusiness.get('emailBusiness').value;
      this.portalGnvClient.TelefonoFijo = this.formCreateClientBusiness.get('telefonoBusiness').value;
      this.portalGnvClient.TelefonoMovil = this.formCreateClientBusiness.get('celularBusiness').value;
      this.portalGnvClient.Contrasena = this.formCreateClientBusiness.get('passwordBusiness').value; 
      this.portalGnvClient.RolId = UserTypeGnv.PersonaEmpresa; 
			this.portalGnvClient.TermPoliticasPrivacidad = this.formCreateClientBusiness.get('tpoliticasCondiciones').value;
			this.portalGnvClient.TermFinesComerciales = this.formCreateClientBusiness.get('tpfinesComerciales').value;
      this.portalGnvClient.NomCliente ="";
      this.portalGnvClient.ApeCliente ="";
      this.portalGnvClient.idTipoDocumento = 0;
      this.portalGnvClient.numeroDocumento = "";
      

			this.RegisterClientBusiness();
		} 
	}

  RegisterClientBusiness(){
    this.clienteRegisterService.registrarClienteEmpresa(this.portalGnvClient).subscribe(response => {
      if (response.valid) {
        this.messageSucces.push(response.message)
        this.commonService.getSuccessHtmlList(this.messageSucces,'/login'); 
      } else {
        let errors = [];
        errors.push('Se generó un error al registrar tus datos, intente nuevamente.');
        this.commonService.getErrorHtmlList(errors); 
      }
    })
  }
}
