import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; 
import { ExpressionValidation } from 'src/app/models/expression-validation';
import { UsuarioRegistrarRequestModel } from 'src/app/models/usuario-registrar/usuario-registrar-request.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { CommonService } from 'src/app/services/common.service';
import { ClienteRegisterService } from 'src/app/services/cliente-register.service';
import { UserTypeGnv } from 'src/app/enums/user-type.enum';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ListSelectModel } from 'src/app/models/listas/listSelect.model';
import { ListSelectService } from 'src/app/services/list-select.service';
import { CorreoService } from 'src/app/services/correo.service';
import { CorreoModel } from 'src/app/models/correo/correo.model';
import { CorreoPlantillaService } from 'src/app/services/correo-plantilla.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {
  //Inicio Persona
  formCreateClientPersona : FormGroup; 
  usuarioRegistrarRequest = new UsuarioRegistrarRequestModel();
  listDocumentos : ListSelectModel;
  //Fin Persona

  //Inicio Empresa
  formCreateClientBusiness : FormGroup; 
  portalGnvClient = new UsuarioRegistrarRequestModel();
  //Fin Empresa

  //Tipo Cliente
  //0 -> Persona
  //1 -> Empresa
  formTipoCliente=0

  messageSucces = [];
  // docsType = [
  //   { value: '1', description: 'DNI' },
  //   { value: '2', description: 'CE' },
  //   { value: '3', description: 'Pasaporte' },
  //   { value: '4', description: 'RUC' }
  // ]; 

  //Mostrar contraseña
  mostrarPassword = true;
  characters: String;
  password :Boolean=false;

  documentNumberMaxlength: number = 1;

  correoModel:CorreoModel;

  constructor(private formBuilder: FormBuilder,
        private authorizesService: AuthorizesService,
        private commonService: CommonService, 
        private clienteRegisterService: ClienteRegisterService,
        private listSelectService:ListSelectService,
        private correoService: CorreoService,
        private correoPlantilla:CorreoPlantillaService) { }

  ngOnInit(): void { 
    this.createClientPersonaForm();
    this.obtenerTipoDocumento();

  }

  //Generar contraseña automatica
  generatePasswordRand(length,Empresa,type) {
    
    if (this.password) {

      if (Empresa=="Persona") {
        this.formCreateClientPersona.patchValue(
          {
            passClient:'',
            passconfirmClient:''
          }
        )
      }else if (Empresa=="Empresa") {
        this.formCreateClientBusiness.patchValue(
          {
            passwordBusiness:'',
            passConfirmBusiness:''
          }
        )
      }
      
    } else {
      switch(type){
        case 'num':
          this.characters = "0123456789";
          break;
        case 'alf':
          this.characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
          break;
        case 'rand':
            //FOR ↓
           break;
        default:
          // this.characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          this.characters=".-$+=?@_123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz"
            break;
    }
    var pass = "";
    
    for (let i = 0; i < length; i++) {
      if(type == 'rand'){
        pass += String.fromCharCode((Math.floor((Math.random() * 100)) % 94) + 33);
    }else{
        pass += this.characters.charAt(Math.floor(Math.random()*this.characters.length));   
    }
      
    }
    
    if (Empresa=="Persona") {
      this.formCreateClientPersona.patchValue(
        {
          passClient:pass,
          passconfirmClient:pass
        }
      )
    }else if (Empresa=="Empresa") {
      this.formCreateClientBusiness.patchValue(
        {
          passwordBusiness:pass,
          passConfirmBusiness:pass
        }
      )
    }

    }
    // //////////////////////////console.log(this.password)
    // return pass;
  }

  //Mostra Persona o empresa
  mostrarPanel(Panel){
    if (Panel=="Persona") {
      this.formTipoCliente=0;
      this.password=false;
      this.formCreateClientPersona.patchValue(
        {
          passClient:'',
          passconfirmClient:''
        }
      )
    }else if (Panel=="Empresa") {
      this.mostrarClientBusiness()
      this.formTipoCliente=1;
      this.password=false;
      this.formCreateClientBusiness.patchValue(
        {
          passwordBusiness:'',
          passConfirmBusiness:''
        }
      )
    }
  }

  obtenerTipoDocumento(){
    this.listSelectService.getListSelect(1001).subscribe(resp=>{
      this.listDocumentos = resp;
    });
  }

  cancelarRegistroUsario(): void{
    this.authorizesService.redirectLogin(); 
  } 

  // Inicio Crear Persona
  createClientPersonaForm() {
    this.formCreateClientPersona = this.formBuilder.group({
      nombreClient: ['', [Validators.required, Validators.pattern(ExpressionValidation.LetterSpace)]],
      apellidoClient: ['', [Validators.required, Validators.pattern(ExpressionValidation.LetterSpace)]],
      emailClient: ['', [Validators.required, Validators.email]],
      telefonoClient: [''],
      celularClient: ['', [Validators.required, Validators.pattern(ExpressionValidation.Celular), Validators.minLength(9), Validators.maxLength(9)]],
      // passClient: ['', [Validators.required, Validators.minLength(6), Validators.pattern(ExpressionValidation.PassWord)]],
      passClient: ['', [Validators.required, Validators.minLength(6)]],
      passconfirmClient: ['', [Validators.required, Validators.minLength(6)]],
      tpoliticasCondiciones: [false, [Validators.requiredTrue]],
      tpfinesComerciales: [false,[Validators.requiredTrue]],
      tipoDocumentoCliente: [null, [Validators.required]],
      numeroDocumentoCliente: [{ value: null, disabled: true }, [Validators.required]],
    },{
      validators: [this.validateClientPasswordConfirmation, this.atLeastClientHomePhoneOrCellPhoneValidator]
    });
  }

  validateClientPasswordConfirmation(abstractControl: AbstractControl) {
		if (abstractControl.get('passClient').value && abstractControl.get('passconfirmClient').value) {
			if (abstractControl.get('passClient').value == abstractControl.get('passconfirmClient').value) return null;
			else return { differentPassword: true };
		} else return null;
	}

  atLeastClientHomePhoneOrCellPhoneValidator(abstractControl: AbstractControl) {
		if ((abstractControl.get('celularClient').value != null
				&& abstractControl.get('celularClient').value.toString().trim() != '')
			  ||
        (abstractControl.get('telefonoClient').value != null
          && abstractControl.get('telefonoClient').value.toString().trim() != '')) {
			  return null;
		} else return { homePhoneOrCellPhoneIsNeeded: true };
	}

  validateClientPersonaForm() {
		if (this.formCreateClientPersona.valid) return true;
		else {
			let errors = [];
      if (this.formCreateClientPersona.get('nombreClient').hasError('required')) errors.push('Debe ingresar sus nombres.');
      else if (!this.formCreateClientPersona.get('nombreClient').valid) errors.push('Debe ingresar su nombre en un formato correcto.');

      if (this.formCreateClientPersona.get('apellidoClient').hasError('required')) errors.push('Debe ingresar sus apellidos.');
			else if (!this.formCreateClientPersona.get('apellidoClient').valid) errors.push('Debe ingresar sus apellidos en un formato correcto.');

      if(this.formCreateClientPersona.get('numeroDocumentoCliente').hasError('required')) errors.push('Debe ingresar un número de documento.'); 
      else if(!this.formCreateClientPersona.get('numeroDocumentoCliente').valid) errors.push('Debe ingresar un número de documento válido.');
      
      if (this.formCreateClientPersona.get('emailClient').hasError('required')) errors.push('Debe ingresar su correo.');
			else if (!this.formCreateClientPersona.get('emailClient').valid) errors.push('Debe ingresar un correo válido.');
            
      if (this.formCreateClientPersona.hasError('homePhoneOrCellPhoneIsNeeded')) errors.push('Debe ingresar al menos un número de teléfono o celular.');
      else if (!this.formCreateClientPersona.get('celularClient').valid) errors.push('Debe ingresar un número de celular válido.');
      else if (!this.formCreateClientPersona.get('telefonoClient').valid) errors.push('Debe ingresar un número de teléfono válido.');

      if (this.formCreateClientPersona.get('passClient').hasError('required')) errors.push('Debe ingresar una contraseña.');
      else if (!this.formCreateClientPersona.get('passClient').valid) errors.push('Debe ingresar una contraseña como mínimo 6 caracteres, un valor numérico, una mayúscula, una minúscula y al menos un símbolo (“@“, “\$”, “!”, “%”, “*”, “?”, “&”, “#”, “^”, “(“, “)”, “_”, “=“, “\\”, “[“, “{“, “]”, “}”, “;”, “:”, “<“, “>”, “|”, “.”, “/“, “,”, “-“).');
      if (this.formCreateClientPersona.get('passconfirmClient').hasError('required')) errors.push('Debe confirmar la contraseña.');
      if (this.formCreateClientPersona.get('passconfirmClient').valid && this.formCreateClientPersona.hasError('differentPassword')) errors.push('Las contraseñas no coinciden.');

      if (this.formCreateClientPersona.get('tpoliticasCondiciones').hasError('required')) errors.push('Debe aceptar los Términos y condiciones y Políticas web de privacidad del Portal Web GNV de Cálidda.');
      else if (!this.formCreateClientPersona.get('tpfinesComerciales').valid) errors.push('Debe aceptar el uso de mi información para fines comerciales.'); 

      this.commonService.getErrorHtmlList(errors);
			return false;
		}
	}

  registerUserTypePersona() {  
		if (this.validateClientPersonaForm()) { 
			this.usuarioRegistrarRequest.NomCliente = this.formCreateClientPersona.get('nombreClient').value;
			this.usuarioRegistrarRequest.ApeCliente = this.formCreateClientPersona.get('apellidoClient').value;
			this.usuarioRegistrarRequest.UsuarioEmail = this.formCreateClientPersona.get('emailClient').value;
			this.usuarioRegistrarRequest.TelefonoFijo = this.formCreateClientPersona.get('telefonoClient').value;
			this.usuarioRegistrarRequest.TelefonoMovil = this.formCreateClientPersona.get('celularClient').value;
			this.usuarioRegistrarRequest.Contrasena = this.formCreateClientPersona.get('passClient').value; 
      this.usuarioRegistrarRequest.RolId = UserTypeGnv.PersonaCliente; 
			this.usuarioRegistrarRequest.TermPoliticasPrivacidad = this.formCreateClientPersona.get('tpoliticasCondiciones').value;
			this.usuarioRegistrarRequest.TermFinesComerciales = this.formCreateClientPersona.get('tpfinesComerciales').value;
      this.usuarioRegistrarRequest.idTipoDocumento = this.formCreateClientPersona.get("tipoDocumentoCliente").value;
      this.usuarioRegistrarRequest.numeroDocumento = this.formCreateClientPersona.get("numeroDocumentoCliente").value;
      this.usuarioRegistrarRequest.Ruc = "";
      this.usuarioRegistrarRequest.RazonSocial = "";

			this.RegisterClientPersona();
		} 
	}

  RegisterClientPersona(){
    this.clienteRegisterService.registrarClientePersona(this.usuarioRegistrarRequest).subscribe(response => {
      //////////////////////////console.log(response)
      
      if (response.valid) {
        this.messageSucces.push(response.message)
        //ENVIAR CORREO
        
        this.correoPlantilla.enviarCorreoCreacionUsuario(
          this.usuarioRegistrarRequest.NomCliente +" "+ this.usuarioRegistrarRequest.ApeCliente,
          this.usuarioRegistrarRequest.UsuarioEmail,
          this.usuarioRegistrarRequest.Contrasena,
          this.usuarioRegistrarRequest.UsuarioEmail
        )
        
        this.commonService.getSuccessHtmlList(this.messageSucces,'/login'); 
      } else {
        let errors = [];
        // errors.push('Se generó un error al registrar tus datos, intente nuevamente.');
        errors.push(response.message);
        this.commonService.getErrorHtmlList(errors); 
      }
    })
  }

  documentTypeChanged(event){
    //////////////////////////console.log(event.value)

    switch(event.value) {
      case 1:
        this.formCreateClientPersona.get('numeroDocumentoCliente').enable();
        this.documentNumberMaxlength = 8;
        this.formCreateClientPersona.get('numeroDocumentoCliente').setValidators([Validators.required, RxwebValidators.numeric({ allowDecimal: false }), Validators.minLength(8), Validators.maxLength(8)])
        break;
      case 2:
        this.formCreateClientPersona.get('numeroDocumentoCliente').enable();
        this.documentNumberMaxlength = 9;
        this.formCreateClientPersona.get('numeroDocumentoCliente').setValidators([Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
        break;
      case 3:
        this.formCreateClientPersona.get('numeroDocumentoCliente').enable();
        this.documentNumberMaxlength = 12;
        this.formCreateClientPersona.get('numeroDocumentoCliente').setValidators([Validators.required, RxwebValidators.numeric({ allowDecimal: false }), Validators.minLength(12), Validators.maxLength(12)]);
        break;
      case 4:
        this.formCreateClientPersona.get('numeroDocumentoCliente').enable();
        this.documentNumberMaxlength = 11;
        this.formCreateClientPersona.get('numeroDocumentoCliente').setValidators([Validators.required, RxwebValidators.numeric({ allowDecimal: false }), Validators.minLength(11), Validators.maxLength(11)]);
        break;
    }
    this.formCreateClientPersona.get('numeroDocumentoCliente').updateValueAndValidity();
  }

  //Fin Crear Persona

  //Inicio crear Empresa

  mostrarClientBusiness(){
    this.formTipoCliente=1;
    this.createClientBusinessForm();
  }
  
  createClientBusinessForm() {
    this.formCreateClientBusiness = this.formBuilder.group({
      rucBusiness: ['', [Validators.required, Validators.pattern(ExpressionValidation.Ruc), RxwebValidators.numeric({ allowDecimal: false }), Validators.minLength(11), Validators.maxLength(11)]],
      razonSocial: ['', [Validators.required, Validators.pattern(ExpressionValidation.LetterSpace)]],
      emailBusiness: ['', [Validators.required, Validators.email]],
      telefonoBusiness: ['', [Validators.pattern(ExpressionValidation.Telefono)]],
			celularBusiness: ['', [Validators.required, Validators.pattern(ExpressionValidation.Celular), Validators.minLength(9), Validators.maxLength(9)]],
      passwordBusiness: ['', [Validators.required]],
			passConfirmBusiness: ['', [Validators.required, Validators.minLength(6)]],
      tpoliticasCondiciones: [false, [Validators.requiredTrue]],
      tpfinesComerciales: [false]  
    },{
      validators: [this.validateBusinessPasswordConfirmation, this.atLeastBusinessHomePhoneOrCellPhoneValidator]
    });
  }

  validateBusinessPasswordConfirmation(abstractControl: AbstractControl) {
		if (abstractControl.get('passwordBusiness').value && abstractControl.get('passConfirmBusiness').value) {
			if (abstractControl.get('passwordBusiness').value == abstractControl.get('passConfirmBusiness').value) return null;
			else return { differentPassword: true };
		} else return null;
	}

  atLeastBusinessHomePhoneOrCellPhoneValidator(abstractControl: AbstractControl) {
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
      //////////////////////////console.log(response)

      if (response.valid) {
        this.messageSucces.push(response.message)

        this.correoPlantilla.enviarCorreoCreacionUsuario(this.portalGnvClient.RazonSocial +"-"+ this.portalGnvClient.Ruc,
                          this.portalGnvClient.UsuarioEmail,
                          this.portalGnvClient.Contrasena,
                          this.portalGnvClient.UsuarioEmail);

        this.commonService.getSuccessHtmlList(this.messageSucces,'/login'); 
      } else {
        let errors = [];
        // errors.push('Se generó un error al registrar tus datos, intente nuevamente.');
        errors.push(response.message);
        this.commonService.getErrorHtmlList(errors); 
      }
    })
  }

  

  //Fin crear Empresa
}
