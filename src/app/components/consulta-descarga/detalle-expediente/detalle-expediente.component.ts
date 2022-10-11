import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import { EstadoModel } from 'src/app/models/estados/estado.model';
import { MaestroModel } from 'src/app/models/maestro/maestro.model';
import { CargarDocumentoPostAtencionModel } from 'src/app/models/post-atencion/cargar-documentosPostAtencion.model';
import { DetallePostAtencionModel } from 'src/app/models/post-atencion/detalle-postAtencion.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { CommonService } from 'src/app/services/common.service';
import { CorreoPlantillaService } from 'src/app/services/correo-plantilla.service';
import { DocumentoService } from 'src/app/services/documento.service';
import { EstadosService } from 'src/app/services/estados.service';
import { EvaluacionClienteService } from 'src/app/services/evaluacion-cliente.service';
import { MaestroService } from 'src/app/services/maestro.service';
import { PostAtencionService } from 'src/app/services/postAtencion.service';
import { ModalPdfComponent } from '../../evaluacion/modal-pdf/modal-pdf.component';
import { environment } from 'src/environments/environment'; 


@Component({
  selector: 'app-detalle-expediente',
  templateUrl: './detalle-expediente.component.html',
  styleUrls: ['./detalle-expediente.component.scss']
})
export class DetalleExpedienteComponent implements OnInit {
  formDatosUsuario:FormGroup;
  formDetalleExpediente:FormGroup;
  
  nombFileComPago = 'Adjuntar documento';
  nombFileGuiaRemision = 'Adjuntar documento';
  nombFileDeclaracionConformidad = 'Adjuntar documento';
  nombFileContratoFinanciamiento = 'Adjuntar documento';
  nombFileDNI = 'Adjuntar documento';
  nombFileCertificado = 'Adjuntar documento';
  nombFileDiagnosticoVehiculo = 'Adjuntar documento';
  nombFileRegistroProducto = 'Adjuntar documento';



  //Nombre documentos
  nobFileComPago = 'Comprobante de pago';
  nobFileGuiaRemision = 'Guía remisión';
  nobFileDeclaracionConformidad = 'Declaración de conformidad';
  nobFileContratoFinanciamiento = 'Contrato financiamiento';
  nobFileDNI = 'DNI ';
  nobFileCertificado = 'Certificado';
  nobFileDiagnosticoVehiculo = 'Diagnóstico del Vehículo / Analisis de gases';
  nobFileRegistroProducto= 'Registro producto / Servicio ';
  

  idPostAtencion:number=0;

  archivoBase64:string="";
  documentosBase64=[{},{},{},{},{},{},{},{}];

  numeroExpediente:string=""
  cargaDocumentosPostAtencion:CargarDocumentoPostAtencionModel;

  listaEstados:EstadoModel;

  datosUsuario:AuthorizeModel;

  dataDetallePostAtencion:DetallePostAtencionModel;
  idTipoProducto:number=0;

  maestro:MaestroModel;

  montoMinimoMaximo:string[]=[]
  ocultarBotonGuardar:boolean=false;

  listaDocumentos:any=[];
  urlGNV=environment.urlPG; 

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private postAtencionService:PostAtencionService,
    private route:ActivatedRoute,
    private documentoService:DocumentoService,
    private datePipe: DatePipe,
    private estadoService:EstadosService,
    private authorizesService:AuthorizesService,
    private commonService:CommonService,
    private maestroService:MaestroService,
    private evaluacionClienteService:EvaluacionClienteService,
    private correoPlantilla:CorreoPlantillaService,
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(data=>{
      this.idPostAtencion = data['id'];
     //this.obtenerDatos(this.idPreevaluacion);
    });
    this.listarEstados();

    this.formularioDatos();
    this.crearFormReglasInsert();

    this.obtnerDatosUSerLogeado();

    this.consultarMontoMinMax();
  }

  formularioDatos(){

    

    this.formDatosUsuario = this.formBuilder.group({
      productoFinanciado: [{value:'',disabled: true}],
      productoFinanciadoPrecio: [{value:'',disabled: true}],
      productoFinanciadoProveedor: [{value:'',disabled: true}],
      productoFinanciadoMarca: [{value:'',disabled: true}],
      numeroPlaca: [{value:'',disabled: true}],
      nombreCliente: [{value:'',disabled: true}],
      apellidoCliente: [{value:'',disabled: true}],
      numeroDocumento: [{value:'',disabled: true}],
      fechaNacimiento: [{value:'',disabled: true}],
      telefonoFijo: [{value:'',disabled: true}],
      numeroCelular: [{value:'',disabled: true}],
      correoElectronico: [{value:'',disabled: true}],
      departamento: [{value:'',disabled: true}],
      provincia: [{value:'',disabled: true}],
      distrito: [{value:'',disabled: true}],
      direccionResidencia: [{value:'',disabled: true}],
      estado: [{value:'',disabled: false}],
      observaciones: [{value:'',disabled: false}],
      fechaDespacho: [{value:'',disabled: false}],
    });

    this.obtenerDatosPostAtencion();

    
  }

  obtenerDatosPostAtencion(){

    this.postAtencionService.getDetallePostAtencion(this.idPostAtencion).subscribe( 
      response =>{
        ////////////////////////console.log(response)
        this.dataDetallePostAtencion=response;
        this.idTipoProducto=this.dataDetallePostAtencion.idTipoProducto;
        ////////console.log(this.dataDetallePostAtencion)
        this.formDatosUsuario = this.formBuilder.group({
          productoFinanciado: [{value: this.dataDetallePostAtencion.descripcion,disabled: true}],
          productoFinanciadoPrecio: [{value: this.dataDetallePostAtencion.precioProducto,disabled: true}],
          productoFinanciadoProveedor: [{value: this.dataDetallePostAtencion.nombreProveedor,disabled: true}],
          productoFinanciadoMarca: [{value: this.dataDetallePostAtencion.marcaProducto,disabled: true}],
          numeroPlaca: [{value: this.dataDetallePostAtencion.numPlaca,disabled: true}],
          nombreCliente: [{value: this.dataDetallePostAtencion.nombreCompleto,disabled: true}],
          apellidoCliente: [{value:this.dataDetallePostAtencion.apellidos,disabled: true}],
          numeroDocumento: [{value:this.dataDetallePostAtencion.numDocumento,disabled: true}],
          fechaNacimiento: [{value:this.datePipe.transform(this.dataDetallePostAtencion.fechaNacimiento,'dd/MM/yyyy'),disabled: true}],
          telefonoFijo: [{value:this.dataDetallePostAtencion.telefono,disabled: true}],
          numeroCelular: [{value:this.dataDetallePostAtencion.celular,disabled: true}],
          correoElectronico: [{value:this.dataDetallePostAtencion.email,disabled: true}],
          departamento: [{value:this.dataDetallePostAtencion.departamento,disabled: true}],
          provincia: [{value:this.dataDetallePostAtencion.provincia,disabled: true}],
          distrito: [{value:this.dataDetallePostAtencion.distrito,disabled: true}],
          direccionResidencia: [{value:this.dataDetallePostAtencion.direccionResidencia==undefined?"":this.dataDetallePostAtencion.direccionResidencia,disabled: true}],
          estado: [{value:this.dataDetallePostAtencion.idestado,disabled: false}],
          observaciones: [{value:this.dataDetallePostAtencion.observacion,disabled: false}],
          fechaDespacho: [{value:this.datePipe.transform(this.dataDetallePostAtencion.fechaDespacho,'yyyy-MM-dd'),disabled: false}],
        });

        if (this.dataDetallePostAtencion.idestado!=17) {
          this.ocultarBotonGuardar=true;
          this.consultarDocumentosPA();

        }else{
          this.formDatosUsuario.get("fechaDespacho").setValue("");
        }

        this.numeroExpediente=response.numExpediente;
        ////////////////////////console.log(this.formDatosUsuario)

      }

    )
  }

  crearFormReglasInsert(){
    this.formDetalleExpediente =  this.formBuilder.group({
      fileComprobantePago: [''], 
      fileGuiaRemision: [''], 
      fileDeclaracionConformidad: [''], 
      fileContratoFinanciamiento: [''], 
      fileDNI: [''], 
      fileDiagnosticoVehiculo: [''], 
      fileCertificado: [''],
      fileRegistroProducto: ['']
    })
  }

   //Métodos Upload Files
   uploadFileSustento(event,nombrecampo:string) {
    // //////////////////////////console.log(event);
    this.transformarBase64(event.target,nombrecampo)
    // this.nobFileFormDatos = event.target.files[0].name;
    // //////////////////////////console.log(event.target.files[0].name);
  }

  transformarBase64(inputValue: any,nombrecampo:string): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();

    myReader.onloadend = (e) => {
      
      var separarTipoDato=myReader.result.toString().split("base64,")
      this.archivoBase64 = separarTipoDato[1];
      // //////////////////////////console.log(this.archivoBase64)

      
      var nombreProceso="PA";
      switch (nombrecampo) {
        case "fileComprobantePago":
          this.nombFileComPago=inputValue.files[0].name;
          this.documentosBase64[0]={
            "fileName":this.nombFileComPago,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileGuiaRemision":
          this.nombFileGuiaRemision=inputValue.files[0].name;
          this.documentosBase64[1]={
            "fileName":this.nombFileGuiaRemision,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileDeclaracionConformidad":
          this.nombFileDeclaracionConformidad=inputValue.files[0].name;
          this.documentosBase64[2]={
            "fileName":this.nombFileDeclaracionConformidad,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileContratoFinanciamiento":
          this.nombFileContratoFinanciamiento=inputValue.files[0].name;
          this.documentosBase64[3]={
            "fileName":this.nombFileContratoFinanciamiento,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileDNI":
          this.nombFileDNI=inputValue.files[0].name;
          this.documentosBase64[4]={
            "fileName":this.nombFileDNI,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileDiagnosticoVehiculo":
          this.nombFileDiagnosticoVehiculo=inputValue.files[0].name;
          this.documentosBase64[5]={
            "fileName":this.nombFileDiagnosticoVehiculo,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileCertificado":
          this.nombFileCertificado=inputValue.files[0].name;
          this.documentosBase64[6]={
            "fileName":this.nombFileCertificado,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileRegistroProducto":
          this.nombFileRegistroProducto=inputValue.files[0].name;
          this.documentosBase64[7]={
            "fileName":this.nombFileRegistroProducto,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        default:
          break;
      }
      // //////////////////////////console.log(myReader.result);
      // //////////////////////////console.log("ARCHIVOS A BASE 64: "+JSON.stringify(this.documentosBase64))
      
    }
    myReader.readAsDataURL(file);
  }

  validacionesDocumentos(montoEsMenor:string){
    // this.guardarDocumentos(id,this.documentosBase64)
    let errors = [];
    var mensajeComplemento=" esta vacío."
    var documentoLlenos=[];
   

    for (let i = 0; i < this.documentosBase64.length; i++) {
      // ////////////console.log("CANTIDAD DE DATOS LL: "+this.documentosBase64.length)
      // ////////////console.log(this.documentosBase64[i]['nombreDocumento'])
      if (Object.keys(this.documentosBase64[i]).length == 0) {

        // ////////////console.log(JSON.stringify(this.documentosBase64))
        if (JSON.stringify(this.documentosBase64[i])=="{}") {
          // ////////////console.log("VACIO "+i)
          switch (i) {
            case 0:
              if (this.documentosBase64[i]['nombreDocumento']==undefined) {
                if (this.idTipoProducto==1 || this.idTipoProducto==2 || this.idTipoProducto==3 || this.idTipoProducto==4) {
                  errors.push(this.nobFileComPago+mensajeComplemento)
                  /* if (montoEsMenor=="Mayor") {
                    errors.push(this.nobFileComPago+mensajeComplemento)
                  }else{
                    errors.push(this.nobFileComPago+mensajeComplemento)
                  } */
                }
                
              }
              break;
            case 1:

              if (this.documentosBase64[i]['nombreDocumento']==undefined) {
                if (this.idTipoProducto==2) {
                  errors.push(this.nobFileGuiaRemision+mensajeComplemento)
                  /* if (montoEsMenor=="Mayor") {
                    errors.push(this.nobFileDeclaracionConformidad+mensajeComplemento)
                  }else{
                    errors.push(this.nobFileDeclaracionConformidad+mensajeComplemento)
                  } */
                }
              }

              break;
            case 2:
              if (this.documentosBase64[i]['nombreDocumento']==undefined) {
                if (this.idTipoProducto==1 || this.idTipoProducto==2 || this.idTipoProducto==3) {
                  errors.push(this.nobFileDeclaracionConformidad+mensajeComplemento)
                  /* if (montoEsMenor=="Mayor") {
                    errors.push(this.nobFileDeclaracionConformidad+mensajeComplemento)
                  }else{
                    errors.push(this.nobFileDeclaracionConformidad+mensajeComplemento)
                  } */
                }
              }
              break;
            case 3:
              if (this.documentosBase64[i]['nombreDocumento']==undefined) {
                /* if (montoEsMenor=="Mayor") {
                }else{
                  errors.push(this.nobFileContratoFinanciamiento+mensajeComplemento)
                } */
              }
              break;
            case 4:
              if (this.documentosBase64[i]['nombreDocumento']==undefined) {
                /* if (montoEsMenor=="Mayor") {
                }else{
                  errors.push(this.nobFileDNI+mensajeComplemento)
                } */
              }
              break;
            case 5:

              break;
            case 6:
              if (this.documentosBase64[i]['nombreDocumento']==undefined) {
                if (this.idTipoProducto==1 || this.idTipoProducto==3) {
                  errors.push(this.nobFileCertificado+mensajeComplemento)
                  /* if (montoEsMenor=="Mayor") {
                    errors.push(this.nobFileDeclaracionConformidad+mensajeComplemento)
                  }else{
                    errors.push(this.nobFileDeclaracionConformidad+mensajeComplemento)
                  } */
                }
              }
              break;
            case 7:
              if (this.documentosBase64[i]['nombreDocumento']==undefined) {
                if (this.idTipoProducto==1 || this.idTipoProducto==2 || this.idTipoProducto==3) {
                  errors.push(this.nobFileRegistroProducto+mensajeComplemento)
                  /* if (montoEsMenor=="Mayor") {
                    errors.push(this.nobFileDeclaracionConformidad+mensajeComplemento)
                  }else{
                    errors.push(this.nobFileDeclaracionConformidad+mensajeComplemento)
                  } */
                }
              }
              break;
          
            default:
              break;
          }
        }
        
  
      }
      else{
        documentoLlenos.push(this.documentosBase64[i])
      }
      
    }

    

    //////////////////////////console.log("JSON: "+JSON.stringify(this.documentosBase64))
    if (Object.keys(errors).length === 0) {
      //Sigue proceso de guardado
      this.documentosBase64=documentoLlenos;

      // ////////////console.log(JSON.stringify(this.documentosBase64))
      this.guardarDocumentoPostAtencion();
    } else{
      this.commonService.getErrorHtmlList(errors);
    }
    
  }

  listarEstados(){
    this.estadoService.getListEstados("CargaPostAtencion").subscribe(response => {
      this.listaEstados=response;
    })
  }

  obtnerDatosUSerLogeado(){
    this.datosUsuario=this.authorizesService.getUserAuth();
    ////////////////////////console.log(this.datosUsuario)
  }

  guardarDocumentoPostAtencion(){
    this.cargaDocumentosPostAtencion={
      idPostAtencion:this.idPostAtencion,
      idEstadoPostAtencion:this.formDatosUsuario.get('estado').value,
      idUsuario:this.datosUsuario.id,
      observacion:this.formDatosUsuario.get('observaciones').value,
      archivos:this.documentosBase64,
      fechaDespacho:this.formDatosUsuario.get('fechaDespacho').value
    }
    ////////////////console.log(JSON.stringify(this.cargaDocumentosPostAtencion))

    this.postAtencionService.postUploadDocumentPostAttention(this.cargaDocumentosPostAtencion).subscribe( 
      response =>{
        if (response.valid) {
          let respuesta = [];
          respuesta.push(response.message)

          this.correoPlantilla.enviarCorreoRegistro(
            this.formDatosUsuario.get('nombreCliente').value+" "+this.formDatosUsuario.get('apellidoCliente').value,
            [this.dataDetallePostAtencion.email],
            "Para informar que su solicitud de financiamiento ha sido entregado, por favor responder la encuesta.<br>"+this.urlGNV+"responde-encuesta",
            "Estado final solicitud de financiamiento.","/gnv/carga-post-atencion")

          this.commonService.getSuccessHtmlList(respuesta,'/gnv/carga-post-atencion');
        } else {
          let errors = [];
          errors.push(response.message);
          this.commonService.getErrorHtmlList(errors); 
        }
      }

    )
    
  }

  consultarMontoMinMax(){

    this.maestro=({
      keyUser:"IMPORTE_FINANCIAMIENTO"
    })

    this.maestroService.getMaestroByClave(this.maestro).subscribe(resp =>{
      this.montoMinimoMaximo=resp.valor.split(',')

    })
  }

  validarMontoMinimoMaximo(){
    // this.dataPreevaluacion
    // this.montoMinimoMaximo
    //2000
    //2980
    var montoMinimo=parseInt(this.montoMinimoMaximo[0])
    var montoMaximo=parseInt(this.montoMinimoMaximo[1])
    
    //Menor a 2000
    if (this.dataDetallePostAtencion.precioProducto<=montoMinimo ) {
      //Proceso guarda en la tabla Evaluacion Crediticia y carga postatencion
      //Siempre y cuando la regla de knockout es ACEPTADO, y en la evaluación cliente es estado es ACEPTADO
      // alert("PRECIO ES MENOR O IGUAL A 2000")

      this.validacionesDocumentos("Menor")

    }else if (this.dataDetallePostAtencion.precioProducto>montoMinimo && this.dataDetallePostAtencion.precioProducto<=montoMaximo) {
      //Enviar un correo
      //Proceso Normal 
      // alert("PRECIO ES MAYOR A 2000 y MENOR A 2980")
  
      this.validacionesDocumentos("Mayor")


    }else if (this.dataDetallePostAtencion.precioProducto>montoMaximo) {
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

  consultarDocumentosPA(){
    this.evaluacionClienteService.getDocumentosEvaluacionCliente('PA',this.idPostAtencion).subscribe(data => {
      //////////console.log(data)
      this.listaDocumentos=data
    });
  }

  openDialogPdf(nombreDocumento:string){

    var dato=[];
    var existeDocumento=false;


    for (let i = 0; i < this.listaDocumentos.length; i++) {
      
      if ( this.listaDocumentos[i].nombreDocumento==nombreDocumento) {
        dato.push({
          "idCargaDocumento":this.listaDocumentos[i].id,
          "tipoProcesoDucumento":"PA",
          "rootArchivo":this.listaDocumentos[i].rootArchivo
        })
        existeDocumento=true;
      }
      
    }

    //////////console.log(dato)

    // this.dialog.open(ModalPdfComponent);

    if (this.listaDocumentos.length<=0 || existeDocumento==false) {
      let errors = [];
      errors.push('Documento no existe');
      this.commonService.getErrorHtmlList(errors);
    }else{
      
      const dialogRef = this.dialog.open(ModalPdfComponent, {
        // width:'50%',
        data: dato[0]
      });

      dialogRef.afterClosed().subscribe(result => {
        ////////////////////////console.log('The dialog was closed');
      });
    }




  }


  verDatosAsesorVentas(){
    // //////////////////////////console.log(idPreevaluacion);
    // this.authorizesService.redirectGestionInformacion(idUsuario);
      var url=document.location.origin+"/gnv/reglas-Knockout/"+this.dataDetallePostAtencion.idPreevaluacion
      var win = window.open(url, '_blank');
      // var win = window.open(url);
      // Cambiar el foco al nuevo tab (punto opcional)
      win.focus();
    
    
  }

}
