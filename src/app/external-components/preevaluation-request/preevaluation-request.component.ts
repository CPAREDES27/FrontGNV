import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PreevaluacionRequestModel } from 'src/app/models/preevaluacion/prevaluacion-request.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { CommonService } from 'src/app/services/common.service';
import { ClienteRegisterService } from 'src/app/services/cliente-register.service';
import { date, even, RxwebValidators } from '@rxweb/reactive-form-validators';
import { ExpressionValidation } from 'src/app/models/expression-validation';

import ListaTipoFinanciamiento  from '../../listas/listaTipoFinanciamiento.json';
import ListaTipoDocumento  from '../../listas/listaDocumentos.json';
// import ListaAsesores  from '../../listas/listaAsesores.json';
import { ListSelectModel } from 'src/app/models/listas/listSelect.model';
import { ListSelectService } from 'src/app/services/list-select.service';
import { ListAsesoresModel } from 'src/app/models/listas/listAsesores.model';
//import { filter } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import { ProductoModel } from 'src/app/models/productos/producto.model';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

//Correo
import { CorreoService } from 'src/app/services/correo.service';
import { CorreoModel } from 'src/app/models/correo/correo.model';
import { CorreoPlantillaService } from 'src/app/services/correo-plantilla.service';
import { MantenimientoService } from 'src/app/services/mantenimiento.service';
import { UsuarioModel } from 'src/app/models/usuarios/usuario.model';
import { MaestroModel } from 'src/app/models/maestro/maestro.model';
import { MaestroService } from 'src/app/services/maestro.service';
import { VentanaService } from 'src/app/services/ventana.service';
import { WINDOW } from 'src/app/services/windows.service';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-preevaluation-request',
  templateUrl: './preevaluation-request.component.html',
  styleUrls: ['./preevaluation-request.component.scss']
})
export class PreevaluationRequestComponent implements OnInit {

  //Cuando el cliente dejo de escribir por 1 segundo
  timeout: any = null;

  formPreevaluation: FormGroup;   
  preevaluacionRequest = new PreevaluacionRequestModel();
  tipoFinanciamiento : ListSelectModel;

  listaAsesores : ListAsesoresModel[];

  listaTipoDocumento : ListSelectModel;

  ListaProductos : ProductoModel;


  /*probar ng-select */
  // productoSeleccionado =0;
  productoSeleccionado:ProductoModel={};

  datosUsuario:UsuarioModel;

  datosUsuarioLogueado:AuthorizeModel;
  

  tipoDocumento:string;
  public listaTipFinanciamiento: any = ListaTipoFinanciamiento;
  //public listaTipoDocumento: any = ListaTipoDocumento;
  // public ListaAsesores: any = ListaAsesores;


  messageSucces = [];
  idEstado: number = 3;
  documentNumberMaxlength: number = 1;
  

  correoModel:CorreoModel

  correoAsesor:string;

  montoMinimoMaximo:string[]=[]
  maestro:MaestroModel;
  correoDefault:string='';

  idAsesorReferido:number=0;
  
  constructor(  
        private formBuilder: FormBuilder,
        private authorizesService: AuthorizesService, 
        private commonService: CommonService,  
        private clienteRegisterService: ClienteRegisterService,
        private correoService: CorreoService,
        private listSelect: ListSelectService,
        private productService:ProductService,
        private router: Router,
        private activatedRoute:ActivatedRoute,
        private correoPlantilla:CorreoPlantillaService,
        private mantenimientoService:MantenimientoService,
        private maestroService:MaestroService,
        @Inject(WINDOW) public window: Window
  ) { }

  fecha = new Date().toISOString();

  ngOnInit(): void { 
/*     //////console.log(window)
    //////console.log(window.opener) */

    if(this.router.url.includes('solicitudPreevaluacion') ) {
      this.activatedRoute.params.subscribe(data => {
       //////////////////////////console.log(data['idprod'])
      //  this.productoSeleccionado = Number(data['idprod']);

      this.ListProductosById(Number(data['idprod']))
      

      })
    }
    if(this.router.url.includes('solicitudReferido') ) {
 
      this.activatedRoute.params.subscribe(data => {
       //////////////////////////console.log(data['idprod'])
      //  this.productoSeleccionado = Number(data['idprod']);

      // this.ListProductosById(Number(data['idprod']))
      this.idAsesorReferido=Number(data['idAsesor']);

      })
    }

    this.createPreevaluationForm();
    
    //this.listTipoFinanciamiento();
    this.listTipoDocumento();
    this.listAsesores();
    this.ListProductos();

    this.consultarMontoMinMax();
    this.consultarCorreoDefault();
    
    this.obtnerDatosUSerLogeado();
    /* this.window.close() */
  }

  addCustomUser = (term) => ({idProducto: term, descripcion: term});

  listTipoDocumento(){
    this.listSelect.getListSelect(1001).subscribe(resp=>{
      this.listaTipoDocumento = resp;
    });
  }

  // listTipoFinanciamiento(){
  //   this.listSelect.getListSelect(1002).subscribe(resp =>{
  //     //////////////////////////console.log(resp)
  //   })
  // }

  ListProductos(){
    //this.formPreevaluation.controls['productoFinanciar'].setValue(2);

    this.productService.getListProductos().subscribe(resp=>{
      // //////////////////////////console.log(resp)

      //this.people.push(resp);
      this.ListaProductos = resp;

    })
  }

  ListProductosById(idProducto){
    //this.formPreevaluation.controls['productoFinanciar'].setValue(2);

    this.productService.getProductoPorId(idProducto).subscribe(resp=>{
      // //////////////////////////console.log(resp)

      //this.people.push(resp);
      this.productoSeleccionado = resp;

    })
  }

  listAsesores(){
    this.listSelect.getListAsesores().subscribe(resp =>{
      //////////////////////////console.log(JSON.stringify(resp))


      var asesores=resp;
      var listaAsesores=[];
      //////////////////////////console.log("LENGHT: "+JSON.stringify(asesores).length)
      ;

      var flag_SinAsesorReferido=false;
      for (let i = 0; i < Object.keys(resp).length; i++) {
        ////////////console.log(resp[i].idUsuario)
        listaAsesores.push(
          {
            "idUsuario": resp[i].idUsuario,
            "nomCliente": resp[i].nomCliente+" "+resp[i].apeCliente,
            "apeCliente": resp[i].apeCliente,
            "email": resp[i].email
          }
        )

        if (resp[i].idUsuario==this.idAsesorReferido) {
          flag_SinAsesorReferido=true;
          this.preevaluacionRequest.nombreAsesorReferido=resp[i].nomCliente+" "+resp[i].apeCliente
        }


        //////////////////////////console.log(listaAsesores)

      }

      if (flag_SinAsesorReferido==false) {
        this.idAsesorReferido=0;
        this.preevaluacionRequest.nombreAsesorReferido=''
      }

      //////////////////////////console.log(listaAsesores)

      this.listaAsesores = JSON.parse(JSON.stringify(listaAsesores));

    })
  }

  createPreevaluationForm() {
    this.formPreevaluation = this.formBuilder.group({
      nombreCliente: ['', [Validators.required, Validators.pattern(ExpressionValidation.LetterSpace)]],
      apellidoCliente: ['', [Validators.required, Validators.pattern(ExpressionValidation.LetterSpace)]],
      tipoDocumentoCliente: [null, [Validators.required]],
      numeroDocumentoCliente: [{ value: null, disabled: true }, [Validators.required]],
      numeroPlacaCliente: ['',[Validators.required]],
      emailCliente: ['', [Validators.required, Validators.email]],
      celularCliente: ['', [Validators.required, Validators.pattern(ExpressionValidation.Celular)]],
      tpoliticasCondiciones: [false, [Validators.requiredTrue]],
      tpfinesComerciales: [false, [Validators.requiredTrue]],
      productoFinanciar: ['',[Validators.required]],
      nombreAsesorReferido: [],
      fechaNacimiento:[],
      direccionSentinel:[]
    });
  }

  getValidateDataForm() {
    if(this.formPreevaluation.valid) return true;
    else{
      let errors = [];
      if(this.formPreevaluation.get('nombreCliente').hasError('required')) errors.push('Debe ingresar su nombre.');
      else if(!this.formPreevaluation.get('nombreCliente').valid) errors.push('Debe ingresar un nombre válido.'); 

      if(this.formPreevaluation.get('apellidoCliente').hasError('required')) errors.push('Debe ingresar su apellido.');
      else if(!this.formPreevaluation.get('apellidoCliente').valid) errors.push('Debe ingresar un apellido válido.'); 

      if(this.formPreevaluation.get('tipoDocumentoCliente').hasError('required')) errors.push('Debe seleccionar un tipo de documento.');

      if(this.formPreevaluation.get('numeroDocumentoCliente').hasError('required')) errors.push('Debe ingresar un número de documento.'); 
      else if(!this.formPreevaluation.get('numeroDocumentoCliente').valid) errors.push('Debe ingresar un número de documento válido.'); 

      if(this.formPreevaluation.get('numeroPlacaCliente').hasError('required')) errors.push('Debe ingresar un número de placa.'); 
      else if(!this.formPreevaluation.get('numeroPlacaCliente').valid) errors.push('Debe ingresar un número de placa válido.'); 

      // if(this.formPreevaluation.get('emailCliente').hasError('required')) errors.push('Debe ingresar su correo');
      // else if(!this.formPreevaluation.get('emailCliente').valid)   errors.push('Debe ingresar un correo válido.'); 

      if (this.formPreevaluation.hasError('homePhoneOrCellPhoneIsNeeded')) errors.push('Debe ingresar un número de celular.');
      else if (!this.formPreevaluation.get('celularCliente').valid) errors.push('Debe ingresar un número de celular válido.'); 

      if(this.formPreevaluation.get('tpoliticasCondiciones').hasError('required')) errors.push('Debe aceptar los Términos y condiciones y Políticas web de privacidad del Portal Web GNV de Cálidda.'); 
      else if (!this.formPreevaluation.get('tpfinesComerciales').valid) errors.push('Debe aceptar el uso de mi información para fines comerciales.'); 

      if (Object.keys(errors).length === 0) {
        //Sigue proceso de guardado
        return true;
      } else{
        this.commonService.getErrorHtmlList(errors);
        return false;
      }

      
    }
  }

  atLeastClientHomePhoneOrCellPhoneValidator(abstractControl: AbstractControl) {
		if ((abstractControl.get('celularCliente').value != null
				&& abstractControl.get('celularCliente').value.toString().trim() != '')) {
			  return null;
		} else return { homePhoneOrCellPhoneIsNeeded: true };
	}
  
  documentTypeChanged(event){
    switch(event.value) {
      case 1:
        this.formPreevaluation.get('numeroDocumentoCliente').enable();
        this.documentNumberMaxlength = 8;
        this.formPreevaluation.get('numeroDocumentoCliente').setValidators([Validators.required, RxwebValidators.numeric({ allowDecimal: false }), Validators.minLength(8), Validators.maxLength(8)])
        this.tipoDocumento="D";
        break;
      case 2:
        this.formPreevaluation.get('numeroDocumentoCliente').enable();
        this.documentNumberMaxlength = 9;
        this.formPreevaluation.get('numeroDocumentoCliente').setValidators([Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
        this.tipoDocumento="4";
        break;
      case 3:
        this.formPreevaluation.get('numeroDocumentoCliente').enable();
        this.documentNumberMaxlength = 12;
        this.formPreevaluation.get('numeroDocumentoCliente').setValidators([Validators.required, RxwebValidators.numeric({ allowDecimal: false }), Validators.minLength(12), Validators.maxLength(12)]);
        this.tipoDocumento="5";
        break;
      case 4:
        this.formPreevaluation.get('numeroDocumentoCliente').enable();
        this.documentNumberMaxlength = 11;
        this.formPreevaluation.get('numeroDocumentoCliente').setValidators([Validators.required, RxwebValidators.numeric({ allowDecimal: false }), Validators.minLength(11), Validators.maxLength(11)]);
        this.tipoDocumento="R";
        break;
    }
    this.formPreevaluation.get('numeroDocumentoCliente').updateValueAndValidity();
  }

  registrarPreevaluacion(montoMenor:string): void { 

    var producto=this.formPreevaluation.get("productoFinanciar").value
    //////////////////////////console.log(producto.idProducto)
    if(this.getValidateDataForm()){ 
      this.preevaluacionRequest.idPreevaluacion = 0;
      this.preevaluacionRequest.idActUsuario=0;
      this.preevaluacionRequest.nombre = this.formPreevaluation.get("nombreCliente").value;
      this.preevaluacionRequest.apellido = this.formPreevaluation.get("apellidoCliente").value; 
      this.preevaluacionRequest.idTipoDocumento = this.formPreevaluation.get("tipoDocumentoCliente").value;
      this.preevaluacionRequest.numDocumento = this.formPreevaluation.get("numeroDocumentoCliente").value;
      // this.preevaluacionRequest.numPlaca = this.formPreevaluation.get("numeroPlacaCliente").value;
      //Extraemos los 3 primeros caracteres y ponemos - y depues los otrso caracteres
      this.preevaluacionRequest.numPlaca = (this.formPreevaluation.get("numeroPlacaCliente").value).substr(0,3) + "-" +(this.formPreevaluation.get("numeroPlacaCliente").value).substr(3,6)
      if (this.formPreevaluation.get("emailCliente").value.length>0) {
        this.preevaluacionRequest.email = this.formPreevaluation.get("emailCliente").value
      }else{
        this.preevaluacionRequest.email = montoMenor=='Menor'?this.correoDefault.replace('Cliente',this.formPreevaluation.get("numeroDocumentoCliente").value):this.formPreevaluation.get("emailCliente").value;
      }
      
      this.preevaluacionRequest.celular = this.formPreevaluation.get("celularCliente").value;
      this.preevaluacionRequest.termCondiciones = this.formPreevaluation.get("tpoliticasCondiciones").value;
      this.preevaluacionRequest.finComerciales = this.formPreevaluation.get("tpfinesComerciales").value;
      this.preevaluacionRequest.fechaNacimiento = this.formPreevaluation.get("fechaNacimiento").value;
      this.preevaluacionRequest.direccionSentinel = this.formPreevaluation.get("direccionSentinel").value;
      if (montoMenor=='Menor') {
        this.preevaluacionRequest.idEstado = 3;
      }else{
        this.preevaluacionRequest.idEstado = this.idEstado;
      }
      this.preevaluacionRequest.fechaRegistro =  `${this.fecha}`;
      // this.preevaluacionRequest.nombreAsesorReferido = this.formPreevaluation.get("nombreAsesorReferido").value;
      this.preevaluacionRequest.idProducto = producto.idProducto;
      this.preevaluacionRequest.flagUser = false;
      this.preevaluacionRequest.idAsesor= this.formPreevaluation.get("nombreAsesorReferido").value;

      if (parseInt(this.formPreevaluation.get("nombreAsesorReferido").value)==0 || this.formPreevaluation.get("nombreAsesorReferido").value=='' || this.formPreevaluation.get("nombreAsesorReferido").value==undefined || this.formPreevaluation.get("nombreAsesorReferido").value==null ) {
        this.preevaluacionRequest.idAsesor=0
        this.preevaluacionRequest.nombreAsesorReferido=''
      } 

      this.getAddPreevaluation()
    } 
  }

  cancelarSolicitud(): void{
    this.authorizesService.redirectLogin(); 
  }

  getAddPreevaluation(){
 
    this.messageSucces=[];
    //////////////////////////console.log(JSON.stringify(this.preevaluacionRequest))
    // this.preevaluacionRequest.tipoFinanciamiento=this.productoSeleccionado;

    var producto=this.formPreevaluation.get("productoFinanciar").value

    this.clienteRegisterService.registrarPreevaluacion(this.preevaluacionRequest).subscribe(response => {
      //////////////////////////console.log(response);
      if(response.error==="Documento")
      {
        Swal.fire({
          title: '',
          text: "Ya existe un usuario registrado con el correo: "+response.correo,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText:'Cancelar'
         
        }).then((result) => {
          if (result.isConfirmed) {
            
            return false;
          }else{
            return false;
          }
        })
        return false;
      }if(response.error==="Correo"){
        Swal.fire({
          title: '',
          text: '',
          html:'Usted ya se encuentra registrado con el correo:'+'</br><b>'+response.correo+'</b></br>¿Desea actualizar el correo?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si&nbsp',
          cancelButtonText:'No'
         
        }).then((result) => {
          if (result.isConfirmed) {
            var pass="";
            for (let i = 0; i < 10; i++) {
              
                pass += String.fromCharCode((Math.floor((Math.random() * 100)) % 94) + 33);
            }
            this.preevaluacionRequest.idActUsuario=1;
            this.preevaluacionRequest.contrasena=pass;
            this.getAddPreevaluation();
             this.correoPlantilla.enviarCorreoCreacionUsuario(this.preevaluacionRequest.nombre +"-"+ this.preevaluacionRequest.numDocumento,
             this.preevaluacionRequest.email,
             pass,
             this.preevaluacionRequest.email);

            
          }else{
            return false;
          }
        })
        return false;
      }
      else{
      if (response.valid) {
        this.messageSucces.push(response.message)

        ////////////console.log(response)
        var correosEnviar:string[];
        var noEnviarCorreo:boolean=false;

        ////////////console.log("CORREO ASESOR "+this.correoAsesor)
        ////////////console.log("CORREO CLIENTE "+this.preevaluacionRequest.email)


        if (this.preevaluacionRequest.email==undefined || this.preevaluacionRequest.email=='' || this.preevaluacionRequest.email==this.correoDefault) {
          if (this.correoAsesor==undefined || this.correoAsesor=='') {
            noEnviarCorreo=true;
          }else{
            correosEnviar=[this.correoAsesor]
          }
        }else{
          if (this.correoAsesor==undefined || this.correoAsesor=='') {
            correosEnviar=[this.preevaluacionRequest.email]
          }else{
            correosEnviar=[this.preevaluacionRequest.email,this.correoAsesor]
          }
        }

        ////////////console.log(noEnviarCorreo)
        ////////////console.log(correosEnviar)

        if (noEnviarCorreo==false) {
          this.correoPlantilla.enviarCorreoPreevaluacion(this.preevaluacionRequest.nombre+" "+this.preevaluacionRequest.apellido,
                    producto.descripcion,
                    producto.nombreProveedor,
                    producto.precio,
                    correosEnviar)
        }
        // enviarCorreo(NombreApellido:string,producto:string,proveedor:string,precio:string,correo:string)
        ////////////console.log(this.messageSucces)
        this.commonService.getSuccessHtmlList(this.messageSucces,''); 

        if (this.window.opener) {
           clearTimeout(this.timeout);
           this.timeout = setTimeout(() => {
           this.window.close();
          }, 1000);
        }
        
      } else {
        let errors = [];
        errors.push(response.message);
        this.commonService.getErrorHtmlList(errors); 
      }
    }
    })

  }

  mayus(e){
    //////////////////////////console.log(e)
    e.key = e.key.toUpperCase();
  }

  obtenerAsesor(asesor){

    if (asesor!=undefined) {
      this.preevaluacionRequest.nombreAsesorReferido=asesor.nomCliente
    // //////////////////////////console.log(this.preevaluacionRequest.nombreAsesorReferido) 
    this.correoAsesor=asesor.email;
    }
    
  }

  obtenerDatosGeneralesPorDocumento(documento:string){
    this.mantenimientoService.getAllUsuariosPaginado(1,1,3,documento).subscribe(resp=>{
      ////////////////////console.log(resp.data)
      if (Object.keys(resp.data).length === 0) {
        this.formPreevaluation.patchValue({
          nombreCliente:'',
          apellidoCliente:'', 
          emailCliente:'',
          celularCliente:''
        })
      }else{
        this.obtenerDatosIdUsuario(resp.data[0].idUsuario)
      }
    })
  }

  realizarFiltro(event: any): void {

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (event.keyCode != 13) {
        this.obtenerDataSentinel(event.target.value==''?0:event.target.value);
        // this.obtenerDatosGeneralesPorDocumento(event.target.value==''?0:event.target.value)
      
      }
    }, 1000);
  }
  obtenerFechaNacimiento(fecha:string){
    let dia=fecha.split("/")[0];
    let mes=fecha.split("/")[1];
    let anio=fecha.split("/")[2];
    return anio+""+mes+""+dia;
  }
  obtenerDataSentinel(numeroDocumento:string){
    this.mantenimientoService.getSentinelService(this.tipoDocumento,numeroDocumento).subscribe(resp =>{
    
        this.formPreevaluation.patchValue({
          nombreCliente: resp.nombres,
          apellidoCliente: resp.apellidos,
          celularCliente: resp.celular,
          emailCliente: resp.email,
          fechaNacimiento:this.obtenerFechaNacimiento(resp.fechaNacimiento),
          direccionSentinel:resp.direccion
        });
    
      
    });
  }

  obtenerDatosIdUsuario(idUsuario:number){
    try {


      this.mantenimientoService.getUsuarioPorId(idUsuario).subscribe(resp =>{

        this.datosUsuario=resp[0];

        // //////////////////////console.log("obtenerDatosGeneralesCliente: "+JSON.stringify(this.datosUsuario))

        this.formPreevaluation.patchValue({
          nombreCliente:this.datosUsuario.nomCliente,
          apellidoCliente:this.datosUsuario.apeCliente,
          tipoDocumentoCliente:this.datosUsuario.idTipoDocumento,
          numeroDocumentoCliente:this.datosUsuario.numeroDocumento,
          emailCliente:this.datosUsuario.usuarioEmail,
          celularCliente:this.datosUsuario.telefonoMovil
        })
 
      });
    } catch (error) {
      
    }
  }

  consultarMontoMinMax(){

    this.maestro=({
      keyUser:"IMPORTE_FINANCIAMIENTO"
    })

    this.maestroService.getMaestroByClave(this.maestro).subscribe(resp =>{
      this.montoMinimoMaximo=resp.valor.split(',')

    })
  }

  consultarCorreoDefault(){

    this.maestro=({
      keyUser:"CORREO_DEFAULT"
    })

    this.maestroService.getMaestroByClave(this.maestro).subscribe(resp =>{
      this.correoDefault=resp.valor

    })
  }

  validarMontos(){
    // this.dataPreevaluacion
    // this.montoMinimoMaximo
    //2000
    //2980
    var montoMinimo=parseInt(this.montoMinimoMaximo[0])
    var montoMaximo=parseInt(this.montoMinimoMaximo[1])
    
    //Menor a 2000
    if (this.productoSeleccionado.precio<=montoMinimo ) {
      //Correo no es requerido
      this.formPreevaluation.get('emailCliente').setValidators([]); // or clearValidators()
      this.formPreevaluation.get('emailCliente').updateValueAndValidity();
  
      // ////////////console.log("EMAIL: "+this.formPreevaluation.get('emailCliente').value)
      // if (this.formPreevaluation.get('emailCliente').value=='') {
      //   this.formPreevaluation.patchValue({
      //     emailCliente:this.correoDefault
      //   })
      // }
      ////////////console.log("CANTIDAD DIGITOS: "+(this.formPreevaluation.get('emailCliente').value).length)
      if ((this.formPreevaluation.get('emailCliente').value).length>0) {
        let errors = [];

        var validarCorreo=/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        if(!validarCorreo.exec(this.formPreevaluation.get('emailCliente').value)){
          errors.push('Debe ingresar un correo válido.');
        }
  
        if (Object.keys(errors).length === 0) {
          //Sigue proceso de guardado
          this.registrarPreevaluacion('Menor');
        } else{
          this.commonService.getErrorHtmlList(errors);
          return false;
        }
      }else{
        this.registrarPreevaluacion('Menor');
      }

      


    }else if (this.productoSeleccionado.precio>montoMinimo && this.productoSeleccionado.precio<=montoMaximo) {
      //Correo es requerido
 
      this.formPreevaluation.get('emailCliente').setValidators([Validators.required]); // or clearValidators()
      this.formPreevaluation.get('emailCliente').updateValueAndValidity();

      // if (this.formPreevaluation.get('emailCliente').value==this.correoDefault) {
      //   this.formPreevaluation.patchValue({
      //     emailCliente:''
      //   })
      // }

      let errors = [];


        var validarCorreo=/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
        if(!validarCorreo.exec(this.formPreevaluation.get('emailCliente').value)){
          errors.push('Debe ingresar un correo válido.');
        }
  
        if (Object.keys(errors).length === 0) {
          //Sigue proceso de guardado
          this.registrarPreevaluacion('Mayor');
        } else{
          this.commonService.getErrorHtmlList(errors);
          return false;
        }
      

    }else if (this.productoSeleccionado.precio>montoMaximo) {
      //Monto mayor al monto maximo
      //Enviar una alerta
      //El importe del producto supera el maximo permitido 
      let errors = [];
      errors.push('El importe del producto supera el máximo permitido.');
      this.commonService.getErrorHtmlList(errors); 
      // alert("El importe del producto supera el maximo permitido ")
    }else{
      //Enviar correo a Asesor de Ventas “Financiamiento fue Rechazado”
      // alert("Enviar correo Financiamiento fue rechazado")

    }
  }

  obtnerDatosUSerLogeado(){
    this.datosUsuarioLogueado=this.authorizesService.getUserAuth();
    console.log(JSON.stringify(this.datosUsuarioLogueado))
    if (this.datosUsuarioLogueado==undefined) {
      return
    }

    this.clienteRegisterService.getObtenerUltimaSolicitud(this.datosUsuarioLogueado.id).subscribe(response => {
      console.log(JSON.stringify(response))
      this.formPreevaluation.patchValue({
        nombreCliente:response.nombre,
        apellidoCliente:response.apellido,
        tipoDocumentoCliente:response.idTipoDocumento,
        numeroDocumentoCliente:response.numDocumento,
        numeroPlacaCliente:response.numPlaca,
        emailCliente:response.email,
        celularCliente:response.celular
      })

    })

  }




}
