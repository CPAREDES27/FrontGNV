import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

//import ListaPerfiles from '../../../listas/listaPerfiles.json';
import ListaDocumentos from '../../../listas/listaDocumentos.json';
import { ExpressionValidation } from 'src/app/models/expression-validation';
import { CommonService } from 'src/app/services/common.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import { DepartamentoModel, DistritoModel, ProvinciaModel } from 'src/app/models/ubigeo/ubigeo.model';
import { ListSelectService } from 'src/app/services/list-select.service';
import { ListSelectModel } from 'src/app/models/listas/listSelect.model';
import { MantenimientoService } from 'src/app/services/mantenimiento.service';
import { UsuarioModel } from 'src/app/models/usuarios/usuario.model';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.scss']
})
export class RegistrarUsuarioComponent implements OnInit {
  
  userFormGroup: FormGroup;

  tipoValidacion: string;
  userLogeado: AuthorizeModel;
  datosUsuario =  new UsuarioModel();

  datosUsuariosEditar: UsuarioModel;
  validaz:boolean=false;
  listaDepartamento:DepartamentoModel;
  listaProvincia:ProvinciaModel;
  listaDistrito:DistritoModel;
  listPerfil:ListSelectModel;
  listTipoCalle : ListSelectModel;
  listEstadoCivil: ListSelectModel;

  textoActivo:string="Activo";

  public formularioUsuario = true;
  //public listPerfil: any = ListaPerfiles;


  listaTipoDocumento : ListSelectModel;

  public documentNumberMaxlength: number = 1;
  fechaHoy = new Date();

  messageSuccess = [];
  idUsuario = 0;
  tipoDocumento2:string;
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService, 
    private ubigeoService:UbigeoService,
    private listSelectService:ListSelectService,
    private mantenimientoService:MantenimientoService,
    private authorizesService:AuthorizesService,
    private activatedRoute:ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit(): void {
    
    if(this.router.url.includes('editar-usuario') ) {
      this.activatedRoute.params
      .pipe(
        switchMap(({id})=> this.mantenimientoService.getUsuarioPorId(id))
      ).subscribe(usuario => {
        this.datosUsuariosEditar = usuario[0];
        this.idUsuario = this.datosUsuariosEditar.idUsuario;
        this.cargarDatosParaEditar();
        
      })
    }

    this.formUser();
    this.obtenerDepartamento();
    this.ontenerPerfiles();
    this.obtenerTipoCalle();
    this.obtenerEstadoCivil();
    this.obtenerTipoDocumento();
    this.obtnerDatosUSerLogeado();

    
  }

  cargarDatosParaEditar(){
    
    //Si en caso el rol es empresa
    if(this.datosUsuariosEditar.rolId==7){
      this.perfilChanged(7);
    }

    this.userFormGroup.controls['perfilUsuario'].setValue(this.datosUsuariosEditar.rolId);
    this.userFormGroup.controls['ruc'].setValue(this.datosUsuariosEditar.ruc);
    this.userFormGroup.controls['razonSocial'].setValue(this.datosUsuariosEditar.razonSocial);
    this.userFormGroup.controls['nombres'].setValue(this.datosUsuariosEditar.nomCliente);
    this.userFormGroup.controls['apellidos'].setValue(this.datosUsuariosEditar.apeCliente);
    this.userFormGroup.controls['tipoDocumento'].setValue(this.datosUsuariosEditar.idTipoDocumento);
    this.userFormGroup.controls['numDocumento'].setValue(this.datosUsuariosEditar.numeroDocumento);
    this.userFormGroup.controls['fechNacimiento'].setValue(this.datosUsuariosEditar.fechaNacimiento.toString().substr(0,10));
    this.userFormGroup.controls['estadoCivil'].setValue(this.datosUsuariosEditar.estadoCivil);
    this.userFormGroup.controls['telefonoFijo'].setValue(this.datosUsuariosEditar.telefonoFijo);
    this.userFormGroup.controls['telefonoMovil'].setValue(this.datosUsuariosEditar.telefonoMovil);
    this.userFormGroup.controls['email'].setValue(this.datosUsuariosEditar.usuarioEmail,);
    this.userFormGroup.controls['tipoCalle'].setValue(this.datosUsuariosEditar.idTipoCalle);
    this.userFormGroup.controls['direccionResidencia'].setValue(this.datosUsuariosEditar.direccionResidencia);
    this.userFormGroup.controls['numInterior'].setValue(this.datosUsuariosEditar.numeroIntDpto);
    this.userFormGroup.controls['mzLt'].setValue(this.datosUsuariosEditar.manzanaLote);
    this.userFormGroup.controls['referencia'].setValue(this.datosUsuariosEditar.referencia);
    this.userFormGroup.controls['distrito'].setValue(this.datosUsuariosEditar.idDistrito);
    this.userFormGroup.controls['provincia'].setValue(this.datosUsuariosEditar.idProvincia);
    this.userFormGroup.controls['estadoUsuario'].setValue(this.datosUsuariosEditar.activo);
    this.userFormGroup.controls['departamento'].setValue(this.datosUsuariosEditar.idDepartamento);
  }


  obtnerDatosUSerLogeado(){
    this.userLogeado = this.authorizesService.getUserAuth();
  }
  obtenerTipoCalle(){
    this.listSelectService.getListSelect(1006).subscribe(resp=>{
      // //////////////////////////console.log(resp);
      this.listTipoCalle = resp;
    });
  }

  obtenerEstadoCivil(){
    this.listSelectService.getListSelect(1003).subscribe(resp=>{
      // //////////////////////////console.log(resp);
      this.listEstadoCivil = resp;
    });
  }

  ontenerPerfiles(){
    this.listSelectService.getListSelect(1005).subscribe(resp=>{
      // //////////////////////////console.log(resp);
      this.listPerfil = resp;
    });
  }

  obtenerDepartamento(){
    this.ubigeoService.getDepartamentos().subscribe(resp=>{
      this.listaDepartamento = resp;

      if (this.router.url.includes('editar-usuario') ) {
          this.obtenerProvincia({value:this.datosUsuariosEditar.idDepartamento});
          this.obtenerDistrito({value:this.datosUsuariosEditar.idProvincia});
      }

    });
  }

  obtenerProvincia(departamento){
    this.ubigeoService.getProvincia(departamento.value).subscribe(resp=>{
      this.listaProvincia = resp;
    });
  }

  obtenerDistrito(provincia){
    this.ubigeoService.getDistrito(provincia.value).subscribe(resp=>{
      this.listaDistrito = resp;
    });
  }

  obtenerTipoDocumento(){
    this.listSelectService.getListSelect(1001).subscribe(resp=>{
      this.listaTipoDocumento = resp;
    });
  }
  formUser(){
    this.userFormGroup = this.formBuilder.group({
      perfilUsuario: ['',Validators.required],
      
      ruc: [''],
      razonSocial: [''],

      nombres: [''],
      apellidos: [''],
      tipoDocumento: [null, [Validators.required]],
      numDocumento: [{ value: null, disabled: true }],
      fechNacimiento: [''],
      estadoCivil: [''],
      telefonoFijo: ['',[Validators.pattern(ExpressionValidation.Telefono)]],
      telefonoMovil: ['',[Validators.required, Validators.pattern(ExpressionValidation.Celular), Validators.minLength(9), Validators.maxLength(9)]],
      email: ['',[Validators.required, Validators.email]],
      tipoCalle: [''],
      estadoUsuario:[true,[Validators.required]],
      direccionResidencia: [''],
      numInterior: [''],
      mzLt: [''],
      referencia: [''],
      distrito: [''],
      provincia: [''],
      departamento: [''],
      contrasenia: [''],
      confirmContrasenia: ['']
    });
  }

  perfilChanged(event){
    //////////////////////////console.log(event)

    //Si es Persona Empresa
    if(event==7){
      this.formularioUsuario=false;
      
      //LIMPIAMOS VALIDATOR DE CLIENTE
      this.userFormGroup.controls['nombres'].clearValidators();
      this.userFormGroup.controls['nombres'].setValue('');
      this.userFormGroup.controls['nombres'].updateValueAndValidity();
      this.userFormGroup.controls['apellidos'].clearValidators();
      this.userFormGroup.controls['apellidos'].setValue('');
      this.userFormGroup.controls['apellidos'].updateValueAndValidity();
      this.userFormGroup.controls['tipoDocumento'].clearValidators();
      this.userFormGroup.controls['tipoDocumento'].setValue('');
      this.userFormGroup.controls['tipoDocumento'].updateValueAndValidity();
      this.userFormGroup.controls['numDocumento'].clearValidators();
      this.userFormGroup.controls['numDocumento'].setValue('');
      this.userFormGroup.controls['numDocumento'].updateValueAndValidity();
      this.userFormGroup.controls['fechNacimiento'].clearValidators();
      this.userFormGroup.controls['fechNacimiento'].setValue('');
      this.userFormGroup.controls['fechNacimiento'].updateValueAndValidity();
      this.userFormGroup.controls['estadoCivil'].clearValidators();
      this.userFormGroup.controls['estadoCivil'].setValue('');
      this.userFormGroup.controls['estadoCivil'].updateValueAndValidity();

      // this.userFormGroup.controls['distrito'].clearValidators();
      // this.userFormGroup.controls['distrito'].setValue('');
      // this.userFormGroup.controls['distrito'].updateValueAndValidity();
      // this.userFormGroup.controls['provincia'].clearValidators();
      // this.userFormGroup.controls['provincia'].setValue('');
      // this.userFormGroup.controls['provincia'].updateValueAndValidity();
      // this.userFormGroup.controls['departamento'].clearValidators();
      // this.userFormGroup.controls['departamento'].setValue('');
      // this.userFormGroup.controls['departamento'].updateValueAndValidity();
      // this.userFormGroup.controls['contrasenia'].clearValidators();
      // this.userFormGroup.controls['contrasenia'].setValue('');
      // this.userFormGroup.controls['contrasenia'].updateValueAndValidity();
      // this.userFormGroup.controls['confirmContrasenia'].clearValidators();
      // this.userFormGroup.controls['confirmContrasenia'].setValue('');
      // this.userFormGroup.controls['confirmContrasenia'].updateValueAndValidity();


      //AGREGAMOS VALIDATOS CUANDO ES EMPRESA
      this.userFormGroup.controls['ruc'].setValidators([Validators.required, Validators.pattern(ExpressionValidation.Ruc), RxwebValidators.numeric({ allowDecimal: false }), Validators.minLength(11), Validators.maxLength(11)]);
      this.userFormGroup.controls['ruc'].updateValueAndValidity();
      this.userFormGroup.controls['razonSocial'].setValidators([Validators.required, Validators.pattern(ExpressionValidation.LetterSpace)]);
      this.userFormGroup.controls['razonSocial'].updateValueAndValidity();

      // this.userFormGroup.controls['distrito'].setValidators([Validators.required]);
      // this.userFormGroup.controls['distrito'].updateValueAndValidity();
      // this.userFormGroup.controls['provincia'].setValidators([Validators.required]);
      // this.userFormGroup.controls['provincia'].updateValueAndValidity();
      // this.userFormGroup.controls['departamento'].setValidators([Validators.required]);
      // this.userFormGroup.controls['departamento'].updateValueAndValidity();
      // this.userFormGroup.controls['contrasenia'].setValidators([Validators.required, Validators.minLength(6), Validators.pattern(ExpressionValidation.PassWord)]);
      // this.userFormGroup.controls['contrasenia'].updateValueAndValidity();
      // this.userFormGroup.controls['confirmContrasenia'].setValidators([Validators.required, Validators.minLength(6)]);
      // this.userFormGroup.controls['confirmContrasenia'].updateValueAndValidity();
      
    }else{
      this.formularioUsuario=true;

       //LIMPIAMOS VALIDATOR DE EMPRESA
       this.userFormGroup.controls['ruc'].clearValidators();
       this.userFormGroup.controls['ruc'].setValue('');
       this.userFormGroup.controls['ruc'].updateValueAndValidity();
       this.userFormGroup.controls['razonSocial'].clearValidators();
       this.userFormGroup.controls['razonSocial'].setValue('');
       this.userFormGroup.controls['razonSocial'].updateValueAndValidity();

      //AGREGAMOS VALIDATOS CUANDO ES USUARIO NATURAL
      this.userFormGroup.controls['nombres'].setValidators([Validators.required, Validators.pattern(ExpressionValidation.LetterSpace)]);
      this.userFormGroup.controls['nombres'].updateValueAndValidity();
      this.userFormGroup.controls['apellidos'].setValidators([Validators.required, Validators.pattern(ExpressionValidation.LetterSpace)]);
      this.userFormGroup.controls['apellidos'].updateValueAndValidity();
      this.userFormGroup.controls['tipoDocumento'].setValidators([Validators.required]);
      this.userFormGroup.controls['tipoDocumento'].updateValueAndValidity();
      this.userFormGroup.controls['numDocumento'].setValidators([Validators.required]);
      this.userFormGroup.controls['numDocumento'].updateValueAndValidity();
      this.userFormGroup.get('numDocumento').disable();
      this.userFormGroup.controls['fechNacimiento'].setValidators([Validators.required]);
      this.userFormGroup.controls['fechNacimiento'].updateValueAndValidity();
      this.userFormGroup.controls['estadoCivil'].setValidators([Validators.required]);
      this.userFormGroup.controls['estadoCivil'].updateValueAndValidity();

      this.userFormGroup.controls['distrito'].setValidators([Validators.required]);
      this.userFormGroup.controls['distrito'].updateValueAndValidity();
      this.userFormGroup.controls['provincia'].setValidators([Validators.required]);
      this.userFormGroup.controls['provincia'].updateValueAndValidity();
      this.userFormGroup.controls['departamento'].setValidators([Validators.required]);
      this.userFormGroup.controls['departamento'].updateValueAndValidity();
      this.userFormGroup.controls['contrasenia'].setValidators([Validators.required, Validators.minLength(6), Validators.pattern(ExpressionValidation.PassWord)]);
      this.userFormGroup.controls['contrasenia'].updateValueAndValidity();
      this.userFormGroup.controls['confirmContrasenia'].setValidators([Validators.required, Validators.minLength(6)]);
      this.userFormGroup.controls['confirmContrasenia'].updateValueAndValidity();

    }
  }
  valida(evt:any){
 // Only ASCII character in that range allowed
 if(this.tipoDocumento2 ==='1'){
 
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)){
      this.validaz=true;
      this.userFormGroup.get('numDocumento').setValidators([Validators.required]);
      this.userFormGroup.get('numDocumento').updateValueAndValidity();
    }
    else{
      this.validaz=false;
    }
  }
  }
  changeTipoDoc(_event: any) {
    debugger;
    this.tipoDocumento2 = _event.value.toString();
    switch (this.tipoDocumento2) {
      case '1':
        this.tipoValidacion = '^[0-9]+$';
        this.documentNumberMaxlength = 8;
   
        break;
      case '2':
        this.tipoValidacion = '^[0-9]+$';
        this.documentNumberMaxlength = 9;
      case '3':
        this.tipoValidacion = '^$|^[A-Za-z0-9]+';
        this.documentNumberMaxlength = 12;
        break;
    }
  }
  documentTypeChanged(event){
    this.userFormGroup.get('numDocumento').setValue("");
    //validamos paar persona natural
    if(this.formularioUsuario){
      //////////////////////////console.log(event.value)
   console.log(event.value);
      switch(event.value) {
        case 1:
 
          //////////////////////////console.log(event.value)
          this.tipoValidacion = '^[0-9]+$';
          this.userFormGroup.get('numDocumento').enable();
          this.documentNumberMaxlength = 8;
          
          break;
        case 2:
          //////////////////////////console.log(event.value)
          this.tipoValidacion = '^[0-9]+$';
          this.userFormGroup.get('numDocumento').enable();
          this.documentNumberMaxlength = 12;
          this.userFormGroup.get('numDocumento').setValidators([Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
          break;
        case 3:
          //////////////////////////console.log(event.value)
          this.tipoValidacion = '^$|^[A-Za-z0-9]+';
          this.userFormGroup.get('numDocumento').enable();
          this.documentNumberMaxlength = 12;
          this.userFormGroup.get('numDocumento').setValidators([Validators.required, RxwebValidators.numeric({ allowDecimal: false }), Validators.minLength(12), Validators.maxLength(12)]);
          break;
          case 4:
          //////////////////////////console.log(event.value)
          this.tipoValidacion = '^$|^[A-Za-z0-9]+';
          this.userFormGroup.get('numDocumento').enable();
          this.documentNumberMaxlength = 11;
          this.userFormGroup.get('numDocumento').setValidators([Validators.required, RxwebValidators.numeric({ allowDecimal: false }), Validators.minLength(12), Validators.maxLength(12)]);
          break;
      }
      this.userFormGroup.get('numDocumento').updateValueAndValidity();
    }
  }
  validateClientPasswordConfirmation(abstractControl: AbstractControl) {
		if (abstractControl.get('contrasenia').value && abstractControl.get('confirmContrasenia').value) {
			if (abstractControl.get('contrasenia').value == abstractControl.get('confirmContrasenia').value) return null;
			else return { differentPassword: true };
		} else return null;
	}

  atLeastClientHomePhoneOrCellPhoneValidator(abstractControl: AbstractControl) {
		if ((abstractControl.get('telefonoMovil').value != null
				&& abstractControl.get('telefonoMovil').value.toString().trim() != '')
			  ||
        (abstractControl.get('telefonoFijo').value != null
          && abstractControl.get('telefonoFijo').value.toString().trim() != '')) {
			  return null;
		} else return { homePhoneOrCellPhoneIsNeeded: true };
	}

  // ========== REGISTRAR USUARIO =======================
  validarFormulario(){
    if(this.userFormGroup.valid) return true;
    else{
      let errors = [];
      
      if(this.formularioUsuario){
        
        // Validaci[on si es persona natural
        if(!this.validaz) errors.push('El documento no puede contener letras');
        if (this.userFormGroup.get('nombres').hasError('required')) errors.push('Ingrese nombres.');
        else if (!this.userFormGroup.get('nombres').valid) errors.push('Ingrese nombres con el formato correcto.');

        if (this.userFormGroup.get('apellidos').hasError('required')) errors.push('Ingrese apellidos.');
        else if (!this.userFormGroup.get('apellidos').valid) errors.push('Ingrese apellidos con el formato correcto.');

        if (this.userFormGroup.get('tipoDocumento').hasError('required')) errors.push('Seleccione tipo de documento.');
        if (this.userFormGroup.get('numDocumento').hasError('required')) errors.push('Ingrese número de documento.');
        if (this.userFormGroup.get('fechNacimiento').hasError('required')) errors.push('Ingrese fecha de nacimiento.');
        if (this.userFormGroup.get('estadoCivil').hasError('required')) errors.push('Ingrese estado Civil.');
      }else{
        //Validación si es empresa
        if (this.userFormGroup.get('ruc').hasError('required')) errors.push('Ingrese número RUC.');
        else if (!this.userFormGroup.get('ruc').valid) errors.push('Ingrese un número RUC válido.');

        if (this.userFormGroup.get('razonSocial').hasError('required')) errors.push('Ingrese razón social de la empresa.');
        else if (!this.userFormGroup.get('razonSocial').valid) errors.push('Ingrese una razón social válida.');
      }

      //Validación general
      if (this.userFormGroup.hasError('homePhoneOrCellPhoneIsNeeded')) errors.push('Ingrese al menos un número de teléfono o celular.');
      else if (!this.userFormGroup.get('telefonoMovil').valid) errors.push('Ingrese un número de celular válido.');
      else if (!this.userFormGroup.get('telefonoMovil').valid) errors.push('Ingrese un número de teléfono válido.');

      if (this.userFormGroup.get('email').hasError('required')) errors.push('Ingrese un correo electrónico.');
			else if (!this.userFormGroup.get('email').valid) errors.push('Ingrese un correo electrónico válido.');

      if (this.userFormGroup.get('departamento').hasError('required')) errors.push('Ingrese departamento.');
      if (this.userFormGroup.get('provincia').hasError('required')) errors.push('Ingrese provincia.');
      if (this.userFormGroup.get('distrito').hasError('required')) errors.push('Ingrese distrito.');
      if (this.userFormGroup.get('estadoUsuario').hasError('required')) errors.push('Seleccione un estado de usuario.');

      if (this.userFormGroup.get('contrasenia').hasError('required')) errors.push('Ingrese una contraseña.');
      else if (!this.userFormGroup.get('contrasenia').valid) errors.push('Ingrese una contraseña de 6 caracteres a más, un valor numérico, una mayúscula, una minúscula y al menos un símbolo (“@“, “\$”, “!”, “%”, “*”, “?”, “&”, “#”, “^”, “(“, “)”, “_”, “=“, “\\”, “[“, “{“, “]”, “}”, “;”, “:”, “<“, “>”, “|”, “.”, “/“, “,”, “-“).');
      if (this.userFormGroup.get('confirmContrasenia').hasError('required')) errors.push('Debe confirmar la contraseña.');
      if (this.userFormGroup.get('confirmContrasenia').valid && this.userFormGroup.hasError('differentPassword')) errors.push('Las contraseñas no coinciden.');

      this.commonService.getErrorHtmlList(errors);
			return false;
    }
  }

  prepararRegistro(){
    if(this.validarFormulario()){
      this.datosUsuario.usuarioEmail        = String(this.userFormGroup.get('email').value);
      this.datosUsuario.contrasena          = String(this.userFormGroup.get('contrasenia').value);
      this.datosUsuario.nomCliente          = String(this.userFormGroup.get('nombres').value);
      this.datosUsuario.apeCliente          = String(this.userFormGroup.get('apellidos').value);
      this.datosUsuario.ruc                 = String(this.userFormGroup.get('ruc').value);
      this.datosUsuario.razonSocial         = String(this.userFormGroup.get('razonSocial').value);
      this.datosUsuario.idTipoDocumento     = Number(this.userFormGroup.get('tipoDocumento').value);
      this.datosUsuario.numeroDocumento     = String(this.userFormGroup.get('numDocumento').value);
      this.datosUsuario.rolId               = Number(this.userFormGroup.get('perfilUsuario').value);
      this.datosUsuario.fechaNacimiento     = this.userFormGroup.get('fechNacimiento').value == '' ? this.fechaHoy : this.userFormGroup.get('fechNacimiento').value;
      this.datosUsuario.estadoCivil         = Number(this.userFormGroup.get('estadoCivil').value);
      this.datosUsuario.telefonoFijo        = String(this.userFormGroup.get('telefonoFijo').value);
      this.datosUsuario.telefonoMovil       = String(this.userFormGroup.get('telefonoMovil').value);
      this.datosUsuario.idTipoCalle         = Number(this.userFormGroup.get('tipoCalle').value);
      this.datosUsuario.direccionResidencia = String(this.userFormGroup.get('direccionResidencia').value);
      this.datosUsuario.numeroIntDpto       = Number(this.userFormGroup.get('numInterior').value);
      this.datosUsuario.manzanaLote         = String(this.userFormGroup.get('mzLt').value);
      this.datosUsuario.referencia          = String(this.userFormGroup.get('referencia').value);
      this.datosUsuario.idDepartamento      = String(this.userFormGroup.get('departamento').value);
      this.datosUsuario.idProvincia         = String(this.userFormGroup.get('provincia').value);
      this.datosUsuario.idDistrito          = String(this.userFormGroup.get('distrito').value);
      this.datosUsuario.activo              = this.userFormGroup.get('estadoUsuario').value;
      this.datosUsuario.fecRegistro         = this.fechaHoy;
      this.datosUsuario.usuarioRegistra     = Number(this.userLogeado.id);
      
      
      //////////////////////////console.log(JSON.stringify(this.datosUsuario));

      this.registrarUsuario();
    }
  }

  registrarUsuario(){
    this.mantenimientoService.registrarUsuario(this.datosUsuario).subscribe(resp=>{
      //////////////////////////console.log(resp);

      if (resp.valid) {
        // this.messageSuccess.push(resp.message)
        // this.commonService.getSuccessHtmlList(this.messageSuccess,'/gnv/gestion-usuario'); 

        Swal.fire({
          title: "Éxito!",
          text: resp.message,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: '#00A1DE'
        });
  
        this.router.navigate(["/gnv/gestion-usuario"]);

      } else {
        Swal.fire({
          title: "Error!",
          text: "Se generó un error al registrar el usuario, intente nuevamente.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: '#00A1DE'
        });

        this.router.navigate(["/gnv/gestion-usuario"]);

        // let errors = [];
        // errors.push('Se generó un error al registrar tus datos, intente nuevamente.');
        // this.commonService.getErrorHtmlList(errors); 
      }
    });

  }


 

  // =============== MODIFICAR USUARIO =======================

  validarFormularioUpdate(){
    if(this.userFormGroup.valid) return true;
    else{
      let errors = [];
      
      if(this.formularioUsuario){
        
        // Validaci[on si es persona natural
        if (this.userFormGroup.get('nombres').hasError('required')) errors.push('Ingrese nombres.');
        else if (!this.userFormGroup.get('nombres').valid) errors.push('Ingrese nombres con el formato correcto.');

        if (this.userFormGroup.get('apellidos').hasError('required')) errors.push('Ingrese apellidos.');
        else if (!this.userFormGroup.get('apellidos').valid) errors.push('Ingrese apellidos con el formato correcto.');

        if (this.userFormGroup.get('tipoDocumento').hasError('required')) errors.push('Seleccione tipo de documento.');
        if (this.userFormGroup.get('numDocumento').hasError('required')) errors.push('Ingrese número de documento.');
        if (this.userFormGroup.get('fechNacimiento').hasError('required')) errors.push('Ingrese fecha de nacimiento.');
        if (this.userFormGroup.get('estadoCivil').hasError('required')) errors.push('Ingrese estado Civil.');
      }else{
        //Validación si es empresa
        if (this.userFormGroup.get('ruc').hasError('required')) errors.push('Ingrese número RUC.');
        else if (!this.userFormGroup.get('ruc').valid) errors.push('Ingrese un número RUC válido.');

        if (this.userFormGroup.get('razonSocial').hasError('required')) errors.push('Ingrese razón social de la empresa.');
        else if (!this.userFormGroup.get('razonSocial').valid) errors.push('Ingrese una razón social válida.');
      }

      //Validación general
      if (this.userFormGroup.hasError('homePhoneOrCellPhoneIsNeeded')) errors.push('Ingrese al menos un número de teléfono o celular.');
      else if (!this.userFormGroup.get('telefonoMovil').valid) errors.push('Ingrese un número de celular válido.');
      else if (!this.userFormGroup.get('telefonoMovil').valid) errors.push('Ingrese un número de teléfono válido.');

      if (this.userFormGroup.get('email').hasError('required')) errors.push('Ingrese un correo electrónico.');
			else if (!this.userFormGroup.get('email').valid) errors.push('Ingrese un correo electrónico válido.');

      this.commonService.getErrorHtmlList(errors);
			return false;
    }
  }

 prepararUpdate(){
   //////////////////////////console.log('sadsad');

    if(this.validarFormularioUpdate()){

      this.datosUsuario.idUsuario           = Number(this.idUsuario);
      this.datosUsuario.usuarioEmail        = String(this.userFormGroup.get('email').value);
      this.datosUsuario.nomCliente          = String(this.userFormGroup.get('nombres').value);
      this.datosUsuario.apeCliente          = String(this.userFormGroup.get('apellidos').value);
      this.datosUsuario.ruc                 = String(this.userFormGroup.get('ruc').value);
      this.datosUsuario.razonSocial         = String(this.userFormGroup.get('razonSocial').value);
      this.datosUsuario.idTipoDocumento     = Number(this.userFormGroup.get('tipoDocumento').value);
      this.datosUsuario.numeroDocumento     = String(this.userFormGroup.get('numDocumento').value);
      this.datosUsuario.rolId               = Number(this.userFormGroup.get('perfilUsuario').value);
      this.datosUsuario.fechaNacimiento     = this.userFormGroup.get('fechNacimiento').value == '' ? this.fechaHoy : this.userFormGroup.get('fechNacimiento').value;
      this.datosUsuario.estadoCivil         = Number(this.userFormGroup.get('estadoCivil').value);
      this.datosUsuario.telefonoFijo        = String(this.userFormGroup.get('telefonoFijo').value);
      this.datosUsuario.telefonoMovil       = String(this.userFormGroup.get('telefonoMovil').value);
      this.datosUsuario.idTipoCalle         = Number(this.userFormGroup.get('tipoCalle').value);
      this.datosUsuario.direccionResidencia = String(this.userFormGroup.get('direccionResidencia').value);
      this.datosUsuario.numeroIntDpto       = Number(this.userFormGroup.get('numInterior').value);
      this.datosUsuario.manzanaLote         = String(this.userFormGroup.get('mzLt').value);
      this.datosUsuario.referencia          = String(this.userFormGroup.get('referencia').value);
      this.datosUsuario.idDepartamento      = String(this.userFormGroup.get('departamento').value);
      this.datosUsuario.idProvincia         = String(this.userFormGroup.get('provincia').value);
      this.datosUsuario.idDistrito          = String(this.userFormGroup.get('distrito').value);
      this.datosUsuario.activo              =this.userFormGroup.get('estadoUsuario').value;
      this.datosUsuario.fechaModifica       = this.fechaHoy;
      this.datosUsuario.usuarioModifica     = Number(this.userLogeado.id);
      this.datosUsuario.contrasena          = this.userFormGroup.get('contrasenia').value==""?"null":this.userFormGroup.get('contrasenia').value;
      
      
      //////console.log(JSON.stringify(this.datosUsuario));

      this.modificarUsuario();
    }
 }

 modificarUsuario(){
  this.mantenimientoService.modificarUsuario(this.datosUsuario).subscribe(resp=>{
    //////////////////////////console.log(resp);

    if (resp.valid) {
      Swal.fire({
        title: "Éxito!",
        text: resp.message,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: '#00A1DE'
      });

      this.router.navigate(["/gnv/gestion-usuario"]);
    } else {
      Swal.fire({
        title: "Error!",
        text: "Se generó un error al actualizar el usuario, intente nuevamente.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: '#00A1DE'
      });
     
      this.router.navigate(["/gnv/gestion-usuario"]);
    }
  });
 }

 onChange(event){
   if (event.checked) {
    this.textoActivo="Activo" 
   }else{
    this.textoActivo="Inactivo" 
   }
 }
 
}
