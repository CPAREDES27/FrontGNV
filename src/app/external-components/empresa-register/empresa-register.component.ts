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
      if (this.formCreateClientBusiness.get('rucBusiness').hasError('required')) errors.push('Debe ingresar un n??mero RUC.');
      else if (!this.formCreateClientBusiness.get('rucBusiness').valid) errors.push('Debe ingresar un n??mero RUC v??lido.');

      if (this.formCreateClientBusiness.get('razonSocial').hasError('required')) errors.push('Debe ingresar su raz??n social.');
			else if (!this.formCreateClientBusiness.get('razonSocial').valid) errors.push('Debe ingresar una raz??n social v??lida.');
      
      if (this.formCreateClientBusiness.get('emailBusiness').hasError('required')) errors.push('Debe ingresar su correo.');
			else if (!this.formCreateClientBusiness.get('emailBusiness').valid) errors.push('Debe ingresar un correo v??lido.');
            
      if (this.formCreateClientBusiness.hasError('homePhoneOrCellPhoneIsNeeded')) errors.push('Debe ingresar al menos un n??mero de tel??fono o celular.');
      else if (!this.formCreateClientBusiness.get('celularBusiness').valid) errors.push('Debe ingresar un n??mero de celular v??lido.');
      else if (!this.formCreateClientBusiness.get('telefonoBusiness').valid) errors.push('Debe ingresar un n??mero de tel??fono v??lido.');

      if (this.formCreateClientBusiness.get('passwordBusiness').hasError('required')) errors.push('Debe ingresar una contrase??a.');
      else if (!this.formCreateClientBusiness.get('passwordBusiness').valid) errors.push('Debe ingresar una contrase??a como m??nimo 6 caracteres, un valor num??rico, una may??scula, una min??scula y al menos un s??mbolo (???@???, ???\$???, ???!???, ???%???, ???*???, ???????, ???&???, ???#???, ???^???, ???(???, ???)???, ???_???, ???=???, ???\\???, ???[???, ???{???, ???]???, ???}???, ???;???, ???:???, ???<???, ???>???, ???|???, ???.???, ???/???, ???,???, ???-???).');
      if (this.formCreateClientBusiness.get('passConfirmBusiness').hasError('required')) errors.push('Debe confirmar la contrase??a.');
      if (this.formCreateClientBusiness.get('passConfirmBusiness').valid && this.formCreateClientBusiness.hasError('differentPassword')) errors.push('Las contrase??as no coinciden.');

      if (this.formCreateClientBusiness.get('tpoliticasCondiciones').hasError('required')) errors.push('Debe aceptar los T??rminos y condiciones y Pol??ticas web de privacidad del Portal Web GNV de C??lidda.');
      
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
        errors.push('Se gener?? un error al registrar tus datos, intente nuevamente.');
        this.commonService.getErrorHtmlList(errors); 
      }
    })
  }
}
