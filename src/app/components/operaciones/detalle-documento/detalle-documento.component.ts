import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import { DocumentoGeneralModel } from 'src/app/models/documento/documentosGeneral.model';
import { DocumentoEvaluacionClienteModel } from 'src/app/models/evaluacion-cliente/documento-evaluacion-cliente.model';
import { ListKnockoutModel } from 'src/app/models/knockout/list-knockout.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { DocumentoService } from 'src/app/services/documento.service';
import { EvaluacionClienteService } from 'src/app/services/evaluacion-cliente.service';
import { ReglasKnockoutService } from 'src/app/services/reglas-knockout.service';
import { ModalPdfComponent } from '../../evaluacion/modal-pdf/modal-pdf.component';

@Component({
  selector: 'app-detalle-documento',
  templateUrl: './detalle-documento.component.html',
  styleUrls: ['./detalle-documento.component.scss']
})
export class DetalleDocumentoComponent implements OnInit {

  formDatosUsuario : FormGroup;  
  formReglasKnockout : FormGroup; 
  
  //Datos de la preevaluacion
  dataPreevaluacion:ListKnockoutModel;
  datosUsuario:AuthorizeModel;

  idPreevaluacion = 0;

  //DOCUMENTOS A BUSCAR
  listaDocumentosGeneral:DocumentoGeneralModel;

  //INICIO DOCUMENTOS MOSTRAR

  listaDocumentosAsesorVenta:DocumentoEvaluacionClienteModel;
  mostrarDocumentosAsesorVenta:boolean=false;

  listaDocumentosReglaKnockout:DocumentoEvaluacionClienteModel;
  mostrarDocumentosReglaKnockout:boolean=false;

  listaDocumentosSolicitudFinanciamiento:DocumentoEvaluacionClienteModel;
  mostrarDocumentosSolicitudFinanciamiento:boolean=false;

  listaDocumentosPostAtencion:DocumentoEvaluacionClienteModel;
  mostrarDocumentosPostAtencion:boolean=false;

  //FIN DOCUMENTOS MOSTRAR

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private authorizesService:AuthorizesService,
    private reglasKnockoutService: ReglasKnockoutService,
    private route:ActivatedRoute,
    private evaluacionClienteService:EvaluacionClienteService,
    private documentoService:DocumentoService) { }

  ngOnInit(): void {

    this.route.params.subscribe(data=>{
      this.idPreevaluacion = data['id'];
     //this.obtenerDatos(this.idPreevaluacion);
    });



    this.formularioDatos();
    this.cargarDataForm(this.idPreevaluacion)<
    this.obtnerDatosUSerLogeado();

  }


  obtnerDatosUSerLogeado(){
    this.datosUsuario=this.authorizesService.getUserAuth();
    // ////////////////////console.log(this.datosUsuario)
/*     this.rolId=parseInt(this.datosUsuario.rol); */

  }

  formularioDatos(){
    this.formDatosUsuario = new FormGroup({

      nombreAnalistaMovilidad:new FormControl(),
      productoFinanciado:new FormControl(),
      productoFinanciadoPrecio:new FormControl(),
      productoFinanciadoProveedor:new FormControl(),
      nombreCliente:new FormControl(),
      apellidoCliente:new FormControl(),
      numeroDocumento:new FormControl(),
      // nacionalidadCliente:new FormControl(),
      numeroPlacaCliente:new FormControl(),
      numeroCelular:new FormControl(),
      correoElectronicoCliente:new FormControl(),
      // detalleObservacion:new FormControl(),
    })
  }

  cargarDataForm(id:number){
    this.reglasKnockoutService.getPendingPrevaluationClient(id).subscribe(data => {
      this.dataPreevaluacion=data[0];
     /*  this.consultarDocumentosAD(this.dataPreevaluacion.idPreevaluacion) */
      this.formDatosUsuario = this.formBuilder.group({
        nombreAnalistaMovilidad: [{value: this.dataPreevaluacion.nombreAsesorReferido,disabled: true},[Validators.required]],
        productoFinanciado: [{value: this.dataPreevaluacion.producto,disabled: true},[Validators.required]],
        productoFinanciadoPrecio: [{value: this.dataPreevaluacion.precio,disabled: true},[Validators.required]],
        productoFinanciadoProveedor: [{value: this.dataPreevaluacion.proveedor,disabled: true},[Validators.required]],
        nombreCliente: [{value: this.dataPreevaluacion.nombre,disabled: true},[Validators.required]],
        apellidoCliente: [{value: this.dataPreevaluacion.apellido,disabled: true},[Validators.required]],
        numeroDocumento: [{value: this.dataPreevaluacion.numDocumento,disabled: true},[Validators.required]],
        numeroPlacaCliente: [{value: this.dataPreevaluacion.numPlaca,disabled: true},[Validators.required]],
        numeroCelular: [{value: this.dataPreevaluacion.celular,disabled: true},[Validators.required]],
        correoElectronicoCliente: [{value: this.dataPreevaluacion.email,disabled: true},[Validators.required]],
      });

      this.consultarDocumentosTotal(this.dataPreevaluacion.idPreevaluacion)

    });

  }

  consultarDocumentosTotal(idPreevaluacion:number){

    this.documentoService.getListaDocumentosTotal(idPreevaluacion).subscribe(data => {
      this.listaDocumentosGeneral=data

      this.cargarDocumentoAsesorVentas(this.listaDocumentosGeneral.idPreevaluacion);
      this.cargarDocumentosReglaKnockout(this.listaDocumentosGeneral.idReglanockout);
      this.cargarDocumentosSolicitudFinanciamiento(this.listaDocumentosGeneral.idSolicitudFinanciamiento);
      this.cargarDocumentosPostAtencion(this.listaDocumentosGeneral.idPostAtencion);

    });

    /* this.listaDocumentosGeneral={
      "idPreevaluacion":1238,
      "idReglanockout":87,
      "idSolicitudFinanciamiento":43,
      "idPostAtencion":38
    } */

    

  }

  cargarDocumentoAsesorVentas(idPreevaluacion:number){
    var tipoDocumento="PV"
    this.evaluacionClienteService.getDocumentosEvaluacionCliente(tipoDocumento,idPreevaluacion).subscribe(data => {
      this.listaDocumentosAsesorVenta=data

      if (data.valid==false) {
        /* alert("SIN DATOS") */
        this.mostrarDocumentosAsesorVenta=false;
      }
      if (data.valid==undefined) {
        this.mostrarDocumentosAsesorVenta=true;
      }
    });

  }

  cargarDocumentosReglaKnockout(idReglaKnockout:number){
    var tipoDocumento="RK"
    this.evaluacionClienteService.getDocumentosEvaluacionCliente(tipoDocumento,idReglaKnockout).subscribe(data => {
      this.listaDocumentosReglaKnockout=data

      if (data.valid==false) {
        /* alert("SIN DATOS") */
        this.mostrarDocumentosReglaKnockout=false;
      }
      if (data.valid==undefined) {
        this.mostrarDocumentosReglaKnockout=true;
      }
    });
  }

  cargarDocumentosSolicitudFinanciamiento(idSolicitudFinanciamiento:number){
    var tipoDocumento="SF"
    this.evaluacionClienteService.getDocumentosEvaluacionCliente(tipoDocumento,idSolicitudFinanciamiento).subscribe(data => {
      this.listaDocumentosSolicitudFinanciamiento=data

      if (data.valid==false) {
        /* alert("SIN DATOS") */
        this.mostrarDocumentosSolicitudFinanciamiento=false;
      }
      if (data.valid==undefined) {
        this.mostrarDocumentosSolicitudFinanciamiento=true;
      }
    });
  }

  cargarDocumentosPostAtencion(idPostAtencion:number){
    var tipoDocumento="PA"
    this.evaluacionClienteService.getDocumentosEvaluacionCliente(tipoDocumento,idPostAtencion).subscribe(data => {
      this.listaDocumentosPostAtencion=data

      if (data.valid==false) {
        /* alert("SIN DATOS") */
        this.mostrarDocumentosPostAtencion=false;
      }
      if (data.valid==undefined) {
        this.mostrarDocumentosPostAtencion=true;
      }
    });
  }

  openDialogPdf(dato:any){
    const dialogRef = this.dialog.open(ModalPdfComponent, {
      // width:'50%',
      data: dato
    });

    dialogRef.afterClosed().subscribe(result => {
      ////////////////////////console.log('The dialog was closed');
    });
  }
}
