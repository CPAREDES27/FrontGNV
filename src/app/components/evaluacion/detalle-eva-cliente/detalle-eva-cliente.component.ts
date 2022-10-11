import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import { EstadoModel } from 'src/app/models/estados/estado.model';
import { DetalleEvaluacionClienteModel } from 'src/app/models/evaluacion-cliente/detalle-evaluacion-cliente.model';
import { RegistrarEvaluacionCrediticiaModel } from 'src/app/models/evaluacion-crediticia/registrar-evaluacion-creditica.model';
import { MaestroModel } from 'src/app/models/maestro/maestro.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { ClienteRegisterService } from 'src/app/services/cliente-register.service';
import { CommonService } from 'src/app/services/common.service';
import { CorreoPlantillaService } from 'src/app/services/correo-plantilla.service';
import { EstadosService } from 'src/app/services/estados.service';
import { EvaluacionClienteService } from 'src/app/services/evaluacion-cliente.service';
import { EvCrediticaCargaPostService } from 'src/app/services/evCreditica-CargaPost.service';
import { MaestroService } from 'src/app/services/maestro.service';
import { ModalPdfComponent } from '../modal-pdf/modal-pdf.component';
import {GlobalVariable} from 'src/app/components/global'
import { ReglasKnockoutService } from 'src/app/services/reglas-knockout.service';
import { MantenimientoService } from 'src/app/services/mantenimiento.service';
import { EvaluacionClienteModel } from 'src/app/models/evaluacion-cliente/evaluacion-cliente.model';

@Component({
  selector: 'app-detalle-eva-cliente',
  templateUrl: './detalle-eva-cliente.component.html',
  styleUrls: ['./detalle-eva-cliente.component.scss']
})
export class DetalleEvaClienteComponent implements OnInit {


  

  formDatosUsuario:FormGroup;
  formDetalleExpediente:FormGroup;

  formDatosEstado:FormGroup;

  idEvaluacionCliente = 0;
  idReglaKnockout=0;

  listaDocumentos:any=[];

  listaEstados:EstadoModel;

  maestro:MaestroModel;

  montoMinimoMaximo:string[]=[]

  dataEvaluacionCliente:DetalleEvaluacionClienteModel;

  registroEvaluacionCrediticia:RegistrarEvaluacionCrediticiaModel;

  datosUsuario:AuthorizeModel;

  nombFileComPago = 'Adjuntar documento';

  deshabilitarFormulario:boolean=false;

  ocultarBotonGuardar:boolean=false;

  numExpediente:string="";


  evaluacionClienteModel:EvaluacionClienteModel;
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private evaluacionCliente:EvaluacionClienteService,
    private route:ActivatedRoute,
    private authorizesService:AuthorizesService,
    private datePipe: DatePipe,
    private estadoService:EstadosService,
    private commonService: CommonService,
    private maestroService:MaestroService,
    private evCrediticaCargaPost:EvCrediticaCargaPostService,
    private correoPlantilla:CorreoPlantillaService,
    private clienteRegisterService: ClienteRegisterService,
    private reglasKnockoutService:ReglasKnockoutService,
    private mantenimientoService:MantenimientoService
    ) { }

  ngOnInit(): void {

    this.consultarMontoMinMax();

    this.route.params.subscribe(data=>{
      this.idEvaluacionCliente = data['id'];
     //this.obtenerDatos(this.idPreevaluacion);
    });


    this.formularioDatos();
    this.crearFormReglasInsert();
    this.crearFormDatosEstado();
    this.listarEstados();

    this.obtnerDatosUSerLogeado();

    
    
  }

  formularioDatos(){
    this.formDatosUsuario = this.formBuilder.group({
      productoFinanciado: [{value:'',disabled: false}],
      productoFinanciadoPrecio: [{value:'',disabled: false}],
      productoFinanciadoProveedor: [{value:'',disabled: false}],
      productoFinanciadoPlaca: [{value:'',disabled: false}],
      nombreCliente: [{value:'',disabled: false}],
      apellidoCliente: [{value:'',disabled: false}],
      numeroDocumento: [{value:'',disabled: false}],
      fechaNacimiento: [{value:'',disabled: false}],
      telefonoFijo: [{value:'',disabled: false}],
      numeroCelular: [{value:'',disabled: false}],
      correoElectronico: [{value:'',disabled: false}],
      direccion: [{value:'',disabled: false}],
      distrito: [{value:'',disabled: false}],
      marca: [{value:'',disabled: false}],
      modelo: [{value:'',disabled: false}]
    });
    this.consultarDatosEvaluacionCliente();
  }

  crearFormReglasInsert(){
    this.formDetalleExpediente =  this.formBuilder.group({

      fileSustento: [''],
      
    })
  }

  crearFormDatosEstado(){
    this.formDatosEstado =  this.formBuilder.group({

      estado: ['',Validators.required],
      observaciones: [''],
      
    })
  }

  consultarDatosEvaluacionCliente(){
    this.evaluacionCliente.getDetalleEvaluacionCliente(this.idEvaluacionCliente).subscribe(data => {

      //////////////////////console.log(data)
      this.dataEvaluacionCliente=data;
      this.numExpediente=this.dataEvaluacionCliente.numExpediente

      if (this.dataEvaluacionCliente.idEstado!=3) {
        this.formDatosEstado =  this.formBuilder.group({
          estado: [this.dataEvaluacionCliente.idEstado,Validators.required],
          // observaciones: ['',Validators.required],
        })
        this.ocultarBotonGuardar=true;
      }

      this.ValidarUsuarioExistente(this.dataEvaluacionCliente.usuarioEmail)
      // if (this.dataEvaluacionCliente.precio>parseInt(this.montoMinimoMaximo[0]) && this.dataEvaluacionCliente.precio<=parseInt(this.montoMinimoMaximo[1])) {
      //   this.ocultarDatosEstado=true;
      // }

      this.validarRealizoSF();

      

    });
  }

  consultarDocumentosEvaluacionCliente(idReglaKnockout:number){
    //////////////console.log(idReglaKnockout)
    this.evaluacionCliente.getDocumentosEvaluacionCliente("PV",idReglaKnockout).subscribe(data => {

      this.listaDocumentos=data


      ////////console.log("DOCUMENTOS")
      ////////console.log(JSON.stringify(data))

    });
  }

  openDialogPdf(nombreDocumento:string){

    var dato=[];
    var existeDocumento=false;

    // //////////////console.log(this.listaDocumentos.length)
    for (let i = 0; i < this.listaDocumentos.length; i++) {
      if ( this.listaDocumentos[i].nombreDocumento==nombreDocumento) {
        dato.push({
          rootArchivo:this.listaDocumentos[i].rootArchivo,
          idCargaDocumento:this.listaDocumentos[i].id,
          tipoProcesoDucumento:this.listaDocumentos[i].tipoProcesoDocumento
        })
        existeDocumento=true;
      }
      
    }
    // //////////////console.log(existeDocumento)
    //////////////////////console.log(dato)

    // this.dialog.open(ModalPdfComponent);

    if (this.listaDocumentos.length<=0 || existeDocumento==false) {
      // alert("ENTRO")
      let errors = [];
      errors.push('Documento no existe');
      this.commonService.getErrorHtmlList(errors);
    }else{
      const dialogRef = this.dialog.open(ModalPdfComponent, {
        // width:'50%',
        data: dato[0]
      });
  
      dialogRef.afterClosed().subscribe(result => {
        //////////////////////console.log('The dialog was closed');
      });
    }

    


  }

 
  listarEstados(){
    this.estadoService.getListEstados("EvaluacionCliente").subscribe(response => {
      this.listaEstados=response;
    })
  }

  obtnerDatosUSerLogeado(){
    this.datosUsuario=this.authorizesService.getUserAuth();
  }

  consultarMontoMinMax(){

    this.maestro=({
      keyUser:"IMPORTE_FINANCIAMIENTO"
    })

    this.maestroService.getMaestroByClave(this.maestro).subscribe(resp =>{
      this.montoMinimoMaximo=resp.valor.split(',')
      // //////////////////console.log(this.montoMinimoMaximo[0])
      // //////////////////console.log(this.montoMinimoMaximo[1])
    })
  }


  validarProcesoGuardadoEvaluacionCliente(){
    // this.dataPreevaluacion
    // this.montoMinimoMaximo
    //2000
    //2980
    var montoMinimo=parseInt(this.montoMinimoMaximo[0])
    var montoMaximo=parseInt(this.montoMinimoMaximo[1])
    //Menor a 2000
    if (this.dataEvaluacionCliente.precio<=montoMinimo && this.formDatosEstado.get("estado").value==7) {
      //Proceso guarda en la tabla Evaluacion Crediticia y carga postatencion
      //Siempre y cuando la regla de knockout es ACEPTADO, y en la evaluación cliente es estado es ACEPTADO
      // alert("PRECIO ES MENOR O IGUAL A 2000")

      this.registroEvaluacionCrediticia=({
        idEvCliente:this.idEvaluacionCliente,
        entidadSBS:0,
        valorDeuda:0,
        reporteSBS:0,
        idEstado:15,
        usuarioRegistro:this.datosUsuario.id,
        observaciones:"Aprobado con regla de Knockout, por favor su atención",
        informacionCR:0
      })
      // //////////////////console.log(JSON.stringify(this.registroEvaluacionCrediticia))
      this.evCrediticaCargaPost.registrarEvaluacionCreditia(this.registroEvaluacionCrediticia);

      this.correoPlantilla.enviarCorreoRegistro(
        this.formDatosUsuario.get('nombreCliente').value+" "+this.formDatosUsuario.get('apellidoCliente').value,
        [this.formDatosUsuario.get('correoElectronico').value,this.dataEvaluacionCliente.correoProveedor],
        "Para informar que su solicitud de financiamiento ha sido aprobado, verifique el estado ingresando al sistema.",
        "Estado solicitud de financiamiento.","/gnv/evaluacion-cliente")

    }else if (this.dataEvaluacionCliente.precio>montoMinimo && this.dataEvaluacionCliente.precio<=montoMaximo) {
      //Enviar un correo
      //Proceso Normal 
      // alert("PRECIO ES MAYOR A 2000 y MENOR A 2980")
      this.registroEvaluacionCrediticia=({
        idEvCliente:this.idEvaluacionCliente,
        entidadSBS:0,
        valorDeuda:0,
        reporteSBS:0,
        idEstado:14,
        usuarioRegistro:this.datosUsuario.id,
        // observaciones:this.formDatosEstado.get("observaciones").value
        observaciones:""
      })

      // //////////////console.log(this.registroEvaluacionCrediticia)
      // alert("REGISTRAR EVALUACION CREDITICIA")
      this.evCrediticaCargaPost.registrarEvaluacionCreditia(this.registroEvaluacionCrediticia);

      


    }else if (this.dataEvaluacionCliente.precio>montoMaximo) {
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
      this.correoPlantilla.enviarCorreoRegistro(
        this.formDatosUsuario.get('nombreCliente').value+" "+this.formDatosUsuario.get('apellidoCliente').value,
        [this.formDatosUsuario.get('correoElectronico').value,this.dataEvaluacionCliente.correoProveedor],
        "Financiamiento fue Rechazado.","Estado solicitud de financiamiento.","/gnv/evaluacion-cliente")
    }
  }

  ValidarUsuarioExistente(correo:string){

    this.clienteRegisterService.getValidarUsuario(correo).subscribe(response => {

      ////////////////console.log(response)

      if (response.activo) {
        
        
        this.deshabilitarFormulario=false;

        this.formDatosUsuario = this.formBuilder.group({
          productoFinanciado: [{value:this.dataEvaluacionCliente.producto,disabled: false}],
          productoFinanciadoPrecio: [{value:this.dataEvaluacionCliente.precio,disabled: false}],
          productoFinanciadoProveedor: [{value:this.dataEvaluacionCliente.proveedor,disabled: false}],
          productoFinanciadoPlaca: [{value:this.dataEvaluacionCliente.numPlaca,disabled: false}],
          nombreCliente: [{value:this.dataEvaluacionCliente.nombre,disabled: false}],
          apellidoCliente: [{value:this.dataEvaluacionCliente.apellido,disabled: false}],
          numeroDocumento: [{value:this.dataEvaluacionCliente.numDocumento,disabled: false}],
          fechaNacimiento: [{value:this.datePipe.transform(this.dataEvaluacionCliente.fechaNacimiento,'yyyy-MM-dd'),disabled: false}],
          telefonoFijo: [{value:this.dataEvaluacionCliente.telefonoFijo,disabled: false}],
          numeroCelular: [{value:this.dataEvaluacionCliente.telefonoMovil,disabled: false}],
          correoElectronico: [{value:this.dataEvaluacionCliente.usuarioEmail,disabled: false}],
          distrito: [{value:this.dataEvaluacionCliente.distrito,disabled: false}],
          direccion: [{value:this.dataEvaluacionCliente.direccionResidencia,disabled: false}],
          marca: [{value:this.dataEvaluacionCliente.marcaAuto,disabled: false}],
          modelo: [{value:this.dataEvaluacionCliente.modeloAuto,disabled: false}],
        });
  
        this.idReglaKnockout=this.dataEvaluacionCliente.idReglanockout;

        this.consultarDocumentosEvaluacionCliente(this.dataEvaluacionCliente.idPreevaluacion);
        /* this.consultarDocumentosEvaluacionCliente(this.idReglaKnockout); */

      } else {

        this.deshabilitarFormulario=true;
        this.formDatosUsuario.disable();
        this.formDatosEstado.disable();

        let errors = [];
            // errors.push('Se generó un error al registrar tus datos, intente nuevamente.');
        errors.push(GlobalVariable.usuarioNoExisteEvCliente);
        this.commonService.getErrorHtmlList(errors);
        
      }
    })

    
  }

  validarRealizoSF(){
    
        
    var montoMinimo=parseInt(this.montoMinimoMaximo[0])
    var montoMaximo=parseInt(this.montoMinimoMaximo[1])

    //Menor a 2000
    if (this.dataEvaluacionCliente.precio<=montoMinimo) {


      this.consultarDatosAdicionalesCliente();
      

    }else if (this.dataEvaluacionCliente.precio>montoMinimo && this.dataEvaluacionCliente.precio<=montoMaximo) {
      //Mostrara mensaje

      //Consultar WS y validar
      // //////////////console.log("IDPREEVALUACION: "+this.dataEvaluacionCliente.idPreevaluacion)
      this.reglasKnockoutService.getValidarPreevaluacionExisteSF(this.dataEvaluacionCliente.idPreevaluacion).subscribe(data => {
        ////////console.log("RESPUESTA 40: "+JSON.stringify(data))
        if (!data.valid) {
          this.deshabilitarFormulario=false;
          this.formDatosUsuario.disable();
          this.formDatosEstado.disable();

          // this.formReglasKnockout.disable();
        let errors = [];
        errors.push(GlobalVariable.usuarioNoCompleto40Preguntas);
        this.commonService.getErrorHtmlList(errors);
        }
  
      });

      

        
      


    }else if (this.dataEvaluacionCliente.precio>montoMaximo) {
      //Monto mayor al monto maximo
      //Enviar una alerta
      //El importe del producto supera el maximo permitido 
      let errors = [];
      errors.push('El importe del producto supera el máximo permitido.');
      this.commonService.getErrorHtmlList(errors); 
      // alert("El importe del producto supera el maximo permitido ")
    }
  }


  consultarDatosAdicionalesCliente(){
    try {

      this.mantenimientoService.consultarDatosAdicionales(this.dataEvaluacionCliente.idCliente,this.dataEvaluacionCliente.idPreevaluacion).subscribe(resp =>{

        
        if (!resp.valid) {


        this.formDatosUsuario.disable();
        this.formDatosEstado.disable();

        let errors = [];
        errors.push(GlobalVariable.usuarioNoCompletoInformacion)
        this.commonService.getErrorHtmlList(errors);   
        }
  
      });
    } catch (error) {
      
    }
  }

  completarDatosCliente(){
    // ////////////////////////console.log(idPreevaluacion);
    // this.authorizesService.redirectGestionInformacion(idUsuario);
      var idUsuario=this.dataEvaluacionCliente.idCliente
      var url=document.location.origin+"/gnv/registro-informacion/"+idUsuario
      var win = window.open(url, '_blank');
      // Cambiar el foco al nuevo tab (punto opcional)
      win.focus();
    
    
  }

  actualizarEvaluacionCliente(){

    this.evaluacionClienteModel={
      idReglaNockout:this.dataEvaluacionCliente.idReglanockout,
      numExpediente:"",
      idEstado:this.formDatosEstado.get("estado").value,
      usuarioRegistro:this.datosUsuario.id,
      observacion:this.formDatosEstado.get("observaciones").value
    }

    //////////////console.log(JSON.stringify(this.evaluacionClienteModel))
    this.evaluacionCliente.postRegisterEvaluacionCliente(this.evaluacionClienteModel).subscribe(resp =>{
      //////////////console.log(resp)
      if (resp.valid) {
        this.validarProcesoGuardadoEvaluacionCliente();
      } else {
        let errors = [];
        errors.push('Se generó un error al actualizar la evaluacion cliente, intente nuevamente.');
        this.commonService.getErrorHtmlList(errors); 
      }

    })
  }

  verDatosAsesorVentas(){
    // //////////////////////////console.log(idPreevaluacion);
    // this.authorizesService.redirectGestionInformacion(idUsuario);
      var url=document.location.origin+"/gnv/reglas-Knockout/"+this.dataEvaluacionCliente.idPreevaluacion
      var win = window.open(url, '_blank');
      // var win = window.open(url);
      // Cambiar el foco al nuevo tab (punto opcional)
      win.focus();
    
    
  }
  
}
