import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import { ExpressionValidation } from 'src/app/models/expression-validation';
import { SolicitudFinanciamientoModel } from 'src/app/models/financiamiento/solicitudFinanciamiento.model';
import { ListaTalleresModel } from 'src/app/models/financiamiento/talleres.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { CommonService } from 'src/app/services/common.service';
import { FinanciamientoService } from 'src/app/services/financiamiento.service';
import { MantenimientoService } from 'src/app/services/mantenimiento.service';
import {DatePipe, DOCUMENT} from '@angular/common';
import Lista40Preguntas from '../../../listas/lista40Preguntas.json';
import ListaRespuestas from '../../../listas/listaRespuestas.json';
import { ProductoPreevaluacionModel } from 'src/app/models/productos/producto-preevaluacion.model';
import { NivelEstudioModel } from 'src/app/models/financiamiento/nivelEstudio.model';
import { EstadoCivilModel } from 'src/app/models/financiamiento/estadoCivil.model';
import { TipoCalleModel } from 'src/app/models/financiamiento/tipoCalle.model';
import { EstadoVehicularModel } from 'src/app/models/financiamiento/estadoVehicular.model';
import { TipoFinanciamientoModel } from 'src/app/models/financiamiento/tipoFinanciamiento.model';
import { TipoCreditoFinanciamientoModel } from 'src/app/models/financiamiento/tipoCreditoFinanciamiento.model';
import { ListaRespuestaFinanciamientoModel } from 'src/app/models/financiamiento/listRespuestaFinanciamiamiento.model';
import { ComboModel } from 'src/app/models/financiamiento/combo.modelo';
import { CargaDocumentoModel } from 'src/app/models/carga-documentos/cargaDocumento.model';
import { CargaDocumentosService } from 'src/app/services/cargaDocumentos.service';
import { UsuarioModel } from 'src/app/models/usuarios/usuario.model';
import { MatStepper } from '@angular/material/stepper';
import { MaestroService } from 'src/app/services/maestro.service';
import { environment } from 'src/environments/environment';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDatepicker } from '@angular/material/datepicker';
import {PendienteFormularioComponent} from './pendiente-formulario/pendiente-formulario.component'
import { MatDialog } from '@angular/material/dialog';
import { FinanciamientoTempService } from 'src/app/services/financiamientoTemp.service';
import { DetalleFinanciamientoComponent } from './detalle-financiamiento/detalle-financiamiento.component';
import { formatDate } from "@angular/common";
import { DistritoModel } from 'src/app/models/ubigeo/ubigeo.model';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import { DireccionModel } from 'src/app/models/financiamiento/direccionModel.model';
@Component({
  selector: 'app-formulario-financiamiento',
  templateUrl: './formulario-financiamiento.component.html',
  styleUrls: ['./formulario-financiamiento.component.scss']
})
export class FormularioFinanciamientoComponent implements OnInit {
  solFinanciamientoModel = new SolicitudFinanciamientoModel();
  solFinanciamientoTempModel = new SolicitudFinanciamientoModel();
  cargaDocumentoSFModel=new CargaDocumentoModel();
  
  datosCliente: AuthorizeModel;
  listaDistrito:DistritoModel;
  listTalleres:ListaTalleresModel;
  listProductoPorCliente: ProductoPreevaluacionModel;

  //Para las 40 preguntas(Sacar score)
  lista40Preguntas:any=Lista40Preguntas;
  listaRespuestas:any=ListaRespuestas;

  public listEstadoCivil: EstadoCivilModel;
  public listNivelEstudios: NivelEstudioModel ;
  public listDireccionModel: DireccionModel;
  public listTipoCalle: TipoCalleModel;
  public listEstadoVehicular: EstadoVehicularModel;
  public listTipoFinanciamiento:TipoFinanciamientoModel;
  public listTipoCreditoFinanciamiento:TipoCreditoFinanciamientoModel;
  distritoCombo:string="";
  inputConsulta = '';

  sinDatos=false;
  //estados por formulario
  form1LLeno = false;
  form2LLeno = false;
  form3LLeno = false;
  form4LLeno = false;
  form5LLeno = false;
  form6LLeno = false;
  form7LLeno = false;
  
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  seventhFormGroup: FormGroup;
  eighthFormGroup: FormGroup;

  // Formulario 7
  nobFileFormDatos = 'Agregar DNI';
  nobFileContFinan = 'Contrato de financiamiento';
  nobFileFormConfor = 'Consentimiento Informado';

  // Formulario 8
  nombFileDni = 'DNI del dueño del vehículo';
  nombFileHud = 'Adjuntar documento';
  nombFileTarjProp = 'Adjuntar documento';
  nombFilePermiso = 'Adjuntar documento';
  nombFileLicencia = 'Adjuntar documento';
  nombFileRecibo = 'Adjuntar documento';
  nombFileRevTecnica = 'Adjuntar documento';
  //nombFileSoat = 'SOAT vigente';
  nombFileContratoFinc = 'Adjuntar documento';
  nombFileFormConform = 'Adjuntar documento';

  //NUEVO FORM 8
  nombFileTPFrontal = 'Tarjeta de Propiedad cara frontal ';
  nombFileTPPosterior = 'Tarjeta de Propiedad cara posterior ';
  nombFileCInformado = 'Foto del Consentimiento Informado'
  nombFileDVCInformado= 'Foto del dueño del vehículo con el Consentimiento Informado ';
  nombFileSoat = 'Cargar SOAT vigente';



  messageSuccess = [];

  isLinear = true;
 
  //Flag se mostrara si teiene preevaluaciones
  flagPreevaluacion:Boolean=true;

  //IdPreevaluacion
  idPreevaluacion:number=0;

  //Lista REspuestass Financiamiento
  listaRespuestaFinanciamiento= new ListaRespuestaFinanciamientoModel();
  //Lista de Combos
  comboNivelEstudio:ComboModel;
  comboDireccion:ComboModel;
  // comboProductoSeleccionado:ComboModel;
  comboEstadoCivil:ComboModel;
  radioEstadoVehiculo:ComboModel={id:0,estado:"SinEstado"};

  fechaNacimiento:number;
  fechaCreacion:number;

  //Transformar a base64
  archivoBase64:string="";
  documentosBase64=[{},{},{},{},{}];
  events

  datosUsuario:UsuarioModel;
  disabledProductoCombo:boolean=false;

  urlVirtualDirectory: string = environment.urlVirtualDirectory;
  
  flagDigitoVerificador:boolean=false;

  flagTemporal:boolean=false;

  @ViewChild('fileInput') fileInput: ElementRef;
   @ViewChild('stepper')
  stepper: MatStepper;

  fileAttr = 'Choose File';

  productoSeleccionado:ProductoPreevaluacionModel={};

  isEditable = true;

  ocultarTaller:Boolean=false;
  cantidadDigitos:number=0;

  //Flag dueño vehiculo
  flagDuenioVehiculo:number=0;

  flagBotonFirmado:boolean=false;


  datosFinanciamiento: Array<any>;
  totalPages: Array<number>;

  totalDatos = 0;
  page = 1;
  size = 10;

  previousPage = false;
  nextPage = false;
  barraPaginado = true;

  txtEstadoCivil:string="";
  txtNivelEstudios:string="";
  txtEstadoVehicular:string="";
  txtTipoFinanciamiento:string="";
  txtTipoCredito:string="";
  distritoSentinel:string="";

  idSfCliente:number=0;
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private financiamientoService:FinanciamientoService,
    private financiamientoTemporalService:FinanciamientoTempService,
    private authorizesService:AuthorizesService,
    private mantenimientoService:MantenimientoService,
    private cargaDocumentoService:CargaDocumentosService,
    private maestroService:MaestroService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private ubigeoService:UbigeoService,
    @Inject(DOCUMENT) document: any
    ) {
     this.crearFormulario1();
     this.crearFormulario2();
     this.crearFormulario3();
     this.crearFormulario4();
     this.crearFormulario5();
     this.crearFormulario6();
     this.crearFormulario7();
     this.crearFormulario8();
    //  //////////////////////////console.log(document.location.href);
    //  //////////////////////////console.log(document.location.origin);

    this.fifthFormGroup.valueChanges.subscribe(v => this.events += `value change, ${v}\n`);

    
    //////////////////////console.log(this.events)

   }

  ngOnInit(): void {
    // //////////////////////////console.log(JSON.stringify(this.lista40Preguntas))
    // //////////////////////////console.log("CANTIDAD REGISTROS 40 preguntas: "+this.lista40Preguntas['EVALUACION_CREDITICIA'].length)
    // this.listProductoPorCliente=ListaProductos;
    // this.obtenerTalleres();
    this.obtenerDistrito();
    this.obtenerNivelesEstudio();
    this.obtenerEstadoCivil();
    this.obtenerTipoCalle();
    this.obtenerEstadoVehicular();
    this.obtenerTipoFinanciamiento();
    this.obtenerTipoCreditoFinanciamiento()

    this.obtnerDatosUSerLogeado();
    // this.obtenerScore(this.lista40Preguntas);
    this.obtenerDatosGeneralesCliente();
    this.distritoSentinel="Ate";

    
  }



  formulaScore(rptPreguntas,SolicitudFinanciamiento:SolicitudFinanciamientoModel){
    var score=750;
    var validacion;
    for (let i = 0; i < this.lista40Preguntas['EVALUACION_CREDITICIA'].length; i++) {
      // const element = array[i];
      //PARA EDAD -> 0
      //PARA ESTADO_CIVIL -> 1
      //PARA NIVEL_ESTUDIO -> 2
      //PARA TIPO_VIVIENDA -> 3
      //PARA TIEMPO_VIVIENDA -> 4
      //PARA OCUPACION -> 5
      //PARA ANTIGUEDAD_OCUPACION -> 6
      //PARA TIPO_CONTRATO -> 7
      //PARA OCUPACION_NIVEL_ESTUDIO -> 8
      //PARA ANTIGUEDAD_VEHICULO -> 9
      //PARA SERVICIO -> 10
      //PARA INGRESOS_MENSUALES -> 11
      //PARA NUMERO_HIJOS -> 12
      //PARA ESTADO_VEHICULO -> 13
      //PARA VIVIENDA_VENC_CONTRATO -> 14
      //PARA PROPIEDAD_SERVICIO -> 15
      switch (i) {
        case 0:
          validacion=this.lista40Preguntas['EVALUACION_CREDITICIA'][i]['EDAD']

          //1 VALIDACION
          for (let i = 0; i < validacion['UnaValidaciones'].length; i++) {

            switch (validacion['UnaValidaciones'][i].tipoValidacion) {
              case "Hasta":

              if (rptPreguntas.EDAD<=validacion['UnaValidaciones'][i].fin) {
                
                score=score+(validacion['UnaValidaciones'][i].puntaje)

              }
                
                break;
              case "Mayor":
                
                if (rptPreguntas.EDAD>validacion['UnaValidaciones'][i].fin) {

                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                }

                break;
              case "Igual":
                
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":
                
                break;  
              default:
                break;
            }

          }

          //2 VALIDACIONES
          for (let i = 0; i < validacion['DosValidaciones'].length; i++) {

            switch (validacion['DosValidaciones'][i].tipoValidacion) {
              case "Hasta":

              if (rptPreguntas.EDAD<=parseInt(validacion['DosValidaciones'][i].fin)) {

                score=score+(validacion['DosValidaciones'][i].puntaje)
              }
                
                break;
              case "Mayor":
                
                if (rptPreguntas.EDAD>parseInt(validacion['DosValidaciones'][i].fin)) {

                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }

                break;
              case "Igual":
                
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":
                
                if (rptPreguntas.EDAD>=parseInt(validacion['DosValidaciones'][i].inicio) &&  rptPreguntas.EDAD<=parseInt(validacion['DosValidaciones'][i].fin)) {

                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
                break;  
              default:
                break;
            }

          }
          //////////////////////////console.log("SCORE "+i+" :"+score)
          break;
        case 1:
          validacion=this.lista40Preguntas['EVALUACION_CREDITICIA'][i]['ESTADO_CIVIL']
          //1 VALIDACION
          for (let i = 0; i < validacion['UnaValidaciones'].length; i++) {
            if (validacion['UnaValidaciones'][i].subCaracteristica==rptPreguntas.ESTADO_CIVIL) {
              
              switch (validacion['UnaValidaciones'][i].tipoValidacion) {
                case "Hasta":
  
                if (rptPreguntas.ESTADO_CIVIL<=validacion['UnaValidaciones'][i].fin) {
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                }
                  
                  break;
                case "Mayor":
                  
                  if (rptPreguntas.ESTADO_CIVIL>validacion['UnaValidaciones'][i].fin) {
                    score=score+(validacion['UnaValidaciones'][i].puntaje)
                  }
  
                  break;
                case "Igual":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break;  
                case "Comparar":
                  
                  break; 
                case "Rangos":
                  
                  break;  
                default:
                  break;
              }
            }

          }

          //2 VALIDACIONES
          for (let i = 0; i < validacion['DosValidaciones'].length; i++) {

            switch (validacion['DosValidaciones'][i].tipoValidacion) {
              case "Hasta":

              if (rptPreguntas.ESTADO_CIVIL<=parseInt(validacion['DosValidaciones'][i].fin)) {
                score=score+(validacion['DosValidaciones'][i].puntaje)
              }
                
                break;
              case "Mayor":
                
                if (rptPreguntas.ESTADO_CIVIL>parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }

                break;
              case "Igual":
                
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":

                if (rptPreguntas.ESTADO_CIVIL>=parseInt(validacion['DosValidaciones'][i].inicio) &&  rptPreguntas.ESTADO_CIVIL<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
                break;  
              default:
                break;
            }

          }
          //////////////////////////console.log("SCORE "+i+" :"+score)
          break;
        case 2:

          validacion=this.lista40Preguntas['EVALUACION_CREDITICIA'][i]['NIVEL_ESTUDIO']
          //1 VALIDACION
          for (let i = 0; i < validacion['UnaValidaciones'].length; i++) {

            if ((validacion['UnaValidaciones'][i].subCaracteristica).indexOf(rptPreguntas.NIVEL_ESTUDIO)>= 0) {
              // //////////////////////////console.log("ENCONTRO COINCIDENCIA DE "+rptPreguntas.NIVEL_ESTUDIO)
              switch (validacion['UnaValidaciones'][i].tipoValidacion) {
                case "Hasta":
  
                if (rptPreguntas.NIVEL_ESTUDIO<=validacion['UnaValidaciones'][i].fin) {
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                }
                  
                  break;
                case "Mayor":
                  
                  if (rptPreguntas.NIVEL_ESTUDIO>validacion['UnaValidaciones'][i].fin) {
                    score=score+(validacion['UnaValidaciones'][i].puntaje)
                  }
  
                  break;
                case "Igual":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break;  
                case "Comparar":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break; 
                case "Rangos":
                  
                  break;  
                default:
                  break;
              }
            }

          }

          //2 VALIDACIONES
          for (let i = 0; i < validacion['DosValidaciones'].length; i++) {

            switch (validacion['DosValidaciones'][i].tipoValidacion) {
              case "Hasta":

              if (rptPreguntas.NIVEL_ESTUDIO<=parseInt(validacion['DosValidaciones'][i].fin)) {
                score=score+(validacion['DosValidaciones'][i].puntaje)
              }
                
                break;
              case "Mayor":
                
                if (rptPreguntas.NIVEL_ESTUDIO>parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }

                break;
              case "Igual":
                
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":

                if (rptPreguntas.NIVEL_ESTUDIO>=parseInt(validacion['DosValidaciones'][i].inicio) &&  rptPreguntas.NIVEL_ESTUDIO<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
                break;  
              default:
                break;
            }

          }
          //////////////////////////console.log("SCORE "+i+" :"+score)
          break;
        case 3:
          
          validacion=this.lista40Preguntas['EVALUACION_CREDITICIA'][i]['TIPO_VIVIENDA']
          //1 VALIDACION
          for (let i = 0; i < validacion['UnaValidaciones'].length; i++) {

            if (validacion['UnaValidaciones'][i].subCaracteristica==rptPreguntas.TIPO_VIVIENDA) {
              switch (validacion['UnaValidaciones'][i].tipoValidacion) {
                case "Hasta":
  
                if (rptPreguntas.TIPO_VIVIENDA<=validacion['UnaValidaciones'][i].fin) {
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                }
                  
                  break;
                case "Mayor":
                  
                  if (rptPreguntas.TIPO_VIVIENDA>validacion['UnaValidaciones'][i].fin) {
                    score=score+(validacion['UnaValidaciones'][i].puntaje)
                  }
  
                  break;
                case "Igual":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break;  
                case "Comparar":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break; 
                case "Rangos":
                  
                  break;  
                default:
                  break;
              }
            }

          }

          //2 VALIDACIONES
          for (let i = 0; i < validacion['DosValidaciones'].length; i++) {

            switch (validacion['DosValidaciones'][i].tipoValidacion) {
              case "Hasta":

              if (rptPreguntas.TIPO_VIVIENDA<=parseInt(validacion['DosValidaciones'][i].fin)) {
                score=score+(validacion['DosValidaciones'][i].puntaje)
              }
                
                break;
              case "Mayor":
                
                if (rptPreguntas.TIPO_VIVIENDA>parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }

                break;
              case "Igual":
                
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":

                if (rptPreguntas.TIPO_VIVIENDA>=parseInt(validacion['DosValidaciones'][i].inicio) &&  rptPreguntas.TIPO_VIVIENDA<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
                break;  
              default:
                break;
            }

          }
          //////////////////////////console.log("SCORE "+i+" :"+score)
          break;
        case 4:
          
          validacion=this.lista40Preguntas['EVALUACION_CREDITICIA'][i]['TIEMPO_VIVIENDA']
          //1 VALIDACION
          for (let i = 0; i < validacion['UnaValidaciones'].length; i++) {

            if (validacion['UnaValidaciones'][i].subCaracteristica=="SinCaracteristica") {
              switch (validacion['UnaValidaciones'][i].tipoValidacion) {
                case "Hasta":
  
                if (rptPreguntas.TIEMPO_VIVIENDA<=validacion['UnaValidaciones'][i].fin) {
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                }
                  
                  break;
                case "Mayor":
                  
                  if (rptPreguntas.TIEMPO_VIVIENDA>validacion['UnaValidaciones'][i].fin) {
                    score=score+(validacion['UnaValidaciones'][i].puntaje)
                  }
  
                  break;
                case "Igual":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break;  
                case "Comparar":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break; 
                case "Rangos":
                  
                  break;  
                default:
                  break;
              }
            }

          }

          //2 VALIDACIONES
          for (let i = 0; i < validacion['DosValidaciones'].length; i++) {

            switch (validacion['DosValidaciones'][i].tipoValidacion) {
              case "Hasta":

              if (rptPreguntas.TIEMPO_VIVIENDA<=parseInt(validacion['DosValidaciones'][i].fin)) {
                score=score+(validacion['DosValidaciones'][i].puntaje)
              }
                
                break;
              case "Mayor":
                
                if (rptPreguntas.TIEMPO_VIVIENDA>parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }

                break;
              case "Igual":
                
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":

                if (rptPreguntas.TIEMPO_VIVIENDA>=parseInt(validacion['DosValidaciones'][i].inicio) &&  rptPreguntas.TIEMPO_VIVIENDA<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
                break; 
              case "Mayor-Hasta":

                if (rptPreguntas.TIEMPO_VIVIENDA>parseInt(validacion['DosValidaciones'][i].inicio) &&  rptPreguntas.TIEMPO_VIVIENDA<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
                break;  
              default:
                break;
            }

          }
          //////////////////////////console.log("SCORE "+i+" :"+score)
          break;
        case 5:
          
          validacion=this.lista40Preguntas['EVALUACION_CREDITICIA'][i]['OCUPACION']
          //1 VALIDACION
          for (let i = 0; i < validacion['UnaValidaciones'].length; i++) {

            if (validacion['UnaValidaciones'][i].subCaracteristica==rptPreguntas.OCUPACION) {
              switch (validacion['UnaValidaciones'][i].tipoValidacion) {
                case "Hasta":
  
                if (rptPreguntas.OCUPACION<=validacion['UnaValidaciones'][i].fin) {
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                }
                  
                  break;
                case "Mayor":
                  
                  if (rptPreguntas.OCUPACION>validacion['UnaValidaciones'][i].fin) {
                    score=score+(validacion['UnaValidaciones'][i].puntaje)
                  }
  
                  break;
                case "Igual":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break;  
                case "Comparar":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break; 
                case "Rangos":
                  
                  break;  
                default:
                  break;
              }
            }

          }

          //2 VALIDACIONES
          for (let i = 0; i < validacion['DosValidaciones'].length; i++) {

            switch (validacion['DosValidaciones'][i].tipoValidacion) {
              case "Hasta":

              if (rptPreguntas.OCUPACION<=parseInt(validacion['DosValidaciones'][i].fin)) {
                score=score+(validacion['DosValidaciones'][i].puntaje)
              }
                
                break;
              case "Mayor":
                
                if (rptPreguntas.OCUPACION>parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }

                break;
              case "Igual":
                
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":

                if (rptPreguntas.OCUPACION>=parseInt(validacion['DosValidaciones'][i].inicio) &&  rptPreguntas.OCUPACION<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
                break;  
              default:
                break;
            }

          }
          //////////////////////////console.log("SCORE "+i+" :"+score)
          break;
        case 6:
          
          validacion=this.lista40Preguntas['EVALUACION_CREDITICIA'][i]['ANTIGUEDAD_OCUPACION']
          //1 VALIDACION
          var datosAntiguedadOcupacion=rptPreguntas.ANTIGUEDAD_OCUPACION.split("-")
          for (let i = 0; i < validacion['UnaValidaciones'].length; i++) {

            if (validacion['UnaValidaciones'][i].subCaracteristica==datosAntiguedadOcupacion[0]) {
              switch (validacion['UnaValidaciones'][i].tipoValidacion) {
                case "Hasta":
  
                  if (validacion['UnaValidaciones'][i].tipoDato=datosAntiguedadOcupacion[2]) {
                    if (parseInt(datosAntiguedadOcupacion[1])<=validacion['UnaValidaciones'][i].fin) {
                      score=score+(validacion['UnaValidaciones'][i].puntaje)
                    }
                  }
                
                  
                  break;
                case "Mayor":

                  if (validacion['UnaValidaciones'][i].tipoDato=datosAntiguedadOcupacion[2]) {
                    if (parseInt(datosAntiguedadOcupacion[1])>validacion['UnaValidaciones'][i].fin) {
                      score=score+(validacion['UnaValidaciones'][i].puntaje)
                    }
                  }
                  
  
                  break;
                case "Igual":
                  if (validacion['UnaValidaciones'][i].tipoDato=datosAntiguedadOcupacion[2]) {
                    score=score+(validacion['UnaValidaciones'][i].puntaje)
                  }
                  
                  break;  
                case "Comparar":
                  if (validacion['UnaValidaciones'][i].tipoDato=datosAntiguedadOcupacion[2]) {
                    score=score+(validacion['UnaValidaciones'][i].puntaje)
                  }
                  
                  break; 
                case "Rangos":
                  
                  break;  
                default:
                  break;
              }
            }

          }

          //2 VALIDACIONES
          for (let i = 0; i < validacion['DosValidaciones'].length; i++) {

            if (validacion['DosValidaciones'][i].subCaracteristica==datosAntiguedadOcupacion[0]) {

              
            switch (validacion['DosValidaciones'][i].tipoValidacion) {
              case "Hasta":

                if (validacion['DosValidaciones'][i].tipoDato==datosAntiguedadOcupacion[2]) {
                  if (parseInt(datosAntiguedadOcupacion[1])<=parseInt(validacion['DosValidaciones'][i].fin)) {
                    score=score+(validacion['DosValidaciones'][i].puntaje)
                  }
                }

              
                
                break;
              case "Mayor":
                
                if (validacion['DosValidaciones'][i].tipoDato==datosAntiguedadOcupacion[2]) {
                  if (parseInt(datosAntiguedadOcupacion[1])>parseInt(validacion['DosValidaciones'][i].fin)) {
                    score=score+(validacion['DosValidaciones'][i].puntaje)
                  }
                }
                
                break;
              case "Igual":
                
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":

              if (validacion['DosValidaciones'][i].tipoDato==datosAntiguedadOcupacion[2]) {
                if (parseInt(datosAntiguedadOcupacion[1])>=parseInt(validacion['DosValidaciones'][i].inicio) && parseInt(datosAntiguedadOcupacion[1])<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  //////////////////////////console.log("ANTIGUEDAD_OCUPACION score: "+score)
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
              }
                
                break;  
              default:
                break;
            }


            }

          }
          //////////////////////////console.log("SCORE "+i+" :"+score)
          break;
        case 7:
          
          validacion=this.lista40Preguntas['EVALUACION_CREDITICIA'][i]['TIPO_CONTRATO']
          //1 VALIDACION
          for (let i = 0; i < validacion['UnaValidaciones'].length; i++) {

            if ((validacion['UnaValidaciones'][i].subCaracteristica).indexOf(rptPreguntas.TIPO_CONTRATO)>= 0) {
              switch (validacion['UnaValidaciones'][i].tipoValidacion) {
                case "Hasta":
  
                if (rptPreguntas.TIPO_CONTRATO<=validacion['UnaValidaciones'][i].fin) {
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                }
                  
                  break;
                case "Mayor":
                  
                  if (rptPreguntas.TIPO_CONTRATO>validacion['UnaValidaciones'][i].fin) {
                    score=score+(validacion['UnaValidaciones'][i].puntaje)
                  }
  
                  break;
                case "Igual":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break;  
                case "Comparar":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break; 
                case "Rangos":
                  
                  break;  
                default:
                  break;
              }
            }

          }

          //2 VALIDACIONES
          for (let i = 0; i < validacion['DosValidaciones'].length; i++) {

            switch (validacion['DosValidaciones'][i].tipoValidacion) {
              case "Hasta":

              if (rptPreguntas.TIPO_CONTRATO<=parseInt(validacion['DosValidaciones'][i].fin)) {
                score=score+(validacion['DosValidaciones'][i].puntaje)
              }
                
                break;
              case "Mayor":
                
                if (rptPreguntas.TIPO_CONTRATO>parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }

                break;
              case "Igual":
                
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":

                if (rptPreguntas.TIPO_CONTRATO>=parseInt(validacion['DosValidaciones'][i].inicio) &&  rptPreguntas.TIPO_CONTRATO<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
                break;  
              default:
                break;
            }

          }
          //////////////////////////console.log("SCORE "+i+" :"+score)
          break;
        case 8:
          validacion=this.lista40Preguntas['EVALUACION_CREDITICIA'][i]['OCUPACION_NIVEL_ESTUDIO']
          //1 VALIDACION
          for (let i = 0; i < validacion['UnaValidaciones'].length; i++) {

            if (validacion['UnaValidaciones'][i].subCaracteristica==rptPreguntas.OCUPACION_NIVEL_ESTUDIO) {
              switch (validacion['UnaValidaciones'][i].tipoValidacion) {
                case "Hasta":
  
                if (rptPreguntas.OCUPACION_NIVEL_ESTUDIO<=validacion['UnaValidaciones'][i].fin) {
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                }
                  
                  break;
                case "Mayor":
                  
                  if (rptPreguntas.OCUPACION_NIVEL_ESTUDIO>validacion['UnaValidaciones'][i].fin) {
                    score=score+(validacion['UnaValidaciones'][i].puntaje)
                  }
  
                  break;
                case "Igual":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break;  
                case "Comparar":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break; 
                case "Rangos":
                  
                  break;  
                default:
                  break;
              }
            }

          }

          //2 VALIDACIONES
          for (let i = 0; i < validacion['DosValidaciones'].length; i++) {

            switch (validacion['DosValidaciones'][i].tipoValidacion) {
              case "Hasta":

              if (rptPreguntas.OCUPACION_NIVEL_ESTUDIO<=parseInt(validacion['DosValidaciones'][i].fin)) {
                score=score+(validacion['DosValidaciones'][i].puntaje)
              }
                
                break;
              case "Mayor":
                
                if (rptPreguntas.OCUPACION_NIVEL_ESTUDIO>parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }

                break;
              case "Igual":
                
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":

                if (rptPreguntas.OCUPACION_NIVEL_ESTUDIO>=parseInt(validacion['DosValidaciones'][i].inicio) &&  rptPreguntas.OCUPACION_NIVEL_ESTUDIO<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
                break;  
              default:
                break;
            }

          }
          //////////////////////////console.log("SCORE "+i+" :"+score)
          break;
        case 9:
          
        
          validacion=this.lista40Preguntas['EVALUACION_CREDITICIA'][i]['ANTIGUEDAD_VEHICULO']
          //1 VALIDACION
          var datosAntiguedadVehiculo=rptPreguntas.ANTIGUEDAD_VEHICULO.split("-")
          for (let i = 0; i < validacion['UnaValidaciones'].length; i++) {

            if (validacion['UnaValidaciones'][i].subCaracteristica=="SinCaracteristica") {
              switch (validacion['UnaValidaciones'][i].tipoValidacion) {
                case "Hasta":
  
                  if (validacion['DosValidaciones'][i].tipoDato==datosAntiguedadVehiculo[1]) {
                    if (datosAntiguedadVehiculo[0]<=validacion['UnaValidaciones'][i].fin) {
                      score=score+(validacion['UnaValidaciones'][i].puntaje)
                    }
                  }
                
                  
                  break;
                case "Mayor":
                  if (validacion['DosValidaciones'][i].tipoDato==datosAntiguedadVehiculo[1]) {
                    if (parseInt(datosAntiguedadVehiculo[0])>validacion['UnaValidaciones'][i].fin) {
                      //////////////////////////console.log("ENTRO: "+score)
                      score=score+(validacion['UnaValidaciones'][i].puntaje)
                    }
                  }
                  
  
                  break;
                case "Igual":
                  if (validacion['DosValidaciones'][i].tipoDato==datosAntiguedadVehiculo[1]) {
                    score=score+(validacion['UnaValidaciones'][i].puntaje)
                  }
                  
                  break;  
                case "Comparar":
                  if (validacion['DosValidaciones'][i].tipoDato==datosAntiguedadVehiculo[1]) {
                    score=score+(validacion['UnaValidaciones'][i].puntaje)
                  }
                  
                  break; 
                case "Rangos":
                  
                  break;  
                default:
                  break;
              }
            }

          }

          //2 VALIDACIONES
          for (let i = 0; i < validacion['DosValidaciones'].length; i++) {

            if (validacion['DosValidaciones'][i].subCaracteristica=="SinCaracteristica") {

              
            switch (validacion['DosValidaciones'][i].tipoValidacion) {
              case "Hasta":

                if (validacion['DosValidaciones'][i].tipoDato==datosAntiguedadVehiculo[1]) {
                  if (datosAntiguedadVehiculo[0]<=parseInt(validacion['DosValidaciones'][i].fin)) {
                    score=score+(validacion['DosValidaciones'][i].puntaje)
                  }
                }

              
                
                break;
              case "Mayor":
                
                if (validacion['DosValidaciones'][i].tipoDato==datosAntiguedadVehiculo[1]) {
                  if (datosAntiguedadVehiculo[0]>parseInt(validacion['DosValidaciones'][i].fin)) {
                    score=score+(validacion['DosValidaciones'][i].puntaje)
                  }
                }
                
                break;
              case "Igual":
                
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":

              if (validacion['DosValidaciones'][i].tipoDato==datosAntiguedadVehiculo[1]) {
                if (datosAntiguedadVehiculo[0]>=parseInt(validacion['DosValidaciones'][i].inicio) &&  datosAntiguedadVehiculo[0]<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
              }
                
                break; 
              case "Mayor-Hasta":

                if (datosAntiguedadVehiculo[0]>parseInt(validacion['DosValidaciones'][i].inicio) &&  datosAntiguedadVehiculo[0]<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
                break;  
              default:
                break;
            }


            }

          }
          //////////////////////////console.log("SCORE "+i+" :"+score)
          break;
        case 10:
          
          validacion=this.lista40Preguntas['EVALUACION_CREDITICIA'][i]['SERVICIO']

          //1 VALIDACION
          for (let i = 0; i < validacion['UnaValidaciones'].length; i++) {

            if (rptPreguntas.SERVICIO==validacion['UnaValidaciones'][i].subCaracteristica) {
              switch (validacion['UnaValidaciones'][i].tipoValidacion) {
                case "Hasta":
  
                if (rptPreguntas.SERVICIO<=validacion['UnaValidaciones'][i].fin) {
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                }
                  
                  break;
                case "Mayor":
                  
                  if (rptPreguntas.SERVICIO>validacion['UnaValidaciones'][i].fin) {
                    score=score+(validacion['UnaValidaciones'][i].puntaje)
                  }
  
                  break;
                case "Igual":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break;  
                case "Comparar":
                  
                  break; 
                case "Rangos":
                  
                  break;  
                default:
                  break;
              }
            }

          }

          //2 VALIDACIONES
          for (let i = 0; i < validacion['DosValidaciones'].length; i++) {

            switch (validacion['DosValidaciones'][i].tipoValidacion) {
              case "Hasta":

              if (rptPreguntas.SERVICIO<=parseInt(validacion['DosValidaciones'][i].fin)) {
                score=score+(validacion['DosValidaciones'][i].puntaje)
              }
                
                break;
              case "Mayor":
                
                if (rptPreguntas.SERVICIO>parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }

                break;
              case "Igual":
                score=score+(validacion['DosValidaciones'][i].puntaje)
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":

                if (rptPreguntas.SERVICIO>=parseInt(validacion['DosValidaciones'][i].inicio) &&  rptPreguntas.SERVICIO<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
                break;  
              default:
                break;
            }

          }
          //////////////////////////console.log("SCORE "+i+" :"+score)
          break;
        case 11:
          
          validacion=this.lista40Preguntas['EVALUACION_CREDITICIA'][i]['INGRESOS_MENSUALES']

          //1 VALIDACION
          for (let i = 0; i < validacion['UnaValidaciones'].length; i++) {

            switch (validacion['UnaValidaciones'][i].tipoValidacion) {
              case "Hasta":

              if (rptPreguntas.INGRESOS_MENSUALES<=validacion['UnaValidaciones'][i].fin) {
                score=score+(validacion['UnaValidaciones'][i].puntaje)
              }
                
                break;
              case "Mayor":
                
                if (rptPreguntas.INGRESOS_MENSUALES>validacion['UnaValidaciones'][i].fin) {
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                }

                break;
              case "Igual":
                
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":
                
                break;  
              default:
                break;
            }

          }

          //2 VALIDACIONES
          for (let i = 0; i < validacion['DosValidaciones'].length; i++) {

            switch (validacion['DosValidaciones'][i].tipoValidacion) {
              case "Hasta":

              if (rptPreguntas.INGRESOS_MENSUALES<=parseInt(validacion['DosValidaciones'][i].fin)) {
                score=score+(validacion['DosValidaciones'][i].puntaje)
              }
                
                break;
              case "Mayor":
                
                if (rptPreguntas.INGRESOS_MENSUALES>parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }

                break;
              case "Igual":
                
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":

                if (rptPreguntas.INGRESOS_MENSUALES>=parseInt(validacion['DosValidaciones'][i].inicio) &&  rptPreguntas.INGRESOS_MENSUALES<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
                break;  
              default:
                break;
            }

          }
          //////////////////////////console.log("SCORE "+i+" :"+score)
          break;
        case 12:
          
          validacion=this.lista40Preguntas['EVALUACION_CREDITICIA'][i]['NUMERO_HIJOS']
          //1 VALIDACION
          for (let i = 0; i < validacion['UnaValidaciones'].length; i++) {

            if (validacion['UnaValidaciones'][i].subCaracteristica==rptPreguntas.NUMERO_HIJOS) {
              switch (validacion['UnaValidaciones'][i].tipoValidacion) {
                case "Hasta":
  
                if (rptPreguntas.NUMERO_HIJOS<=validacion['UnaValidaciones'][i].fin) {
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                }
                  
                  break;
                case "Mayor":
                  
                  if (rptPreguntas.NUMERO_HIJOS>validacion['UnaValidaciones'][i].fin) {
                    score=score+(validacion['UnaValidaciones'][i].puntaje)
                  }
  
                  break;
                case "Igual":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break;  
                case "Comparar":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break; 
                case "Rangos":
                  
                  break;  
                default:
                  break;
              }
            }

          }

          //2 VALIDACIONES
          for (let i = 0; i < validacion['DosValidaciones'].length; i++) {

            switch (validacion['DosValidaciones'][i].tipoValidacion) {
              case "Hasta":

              if (rptPreguntas.NUMERO_HIJOS<=parseInt(validacion['DosValidaciones'][i].fin)) {
                score=score+(validacion['DosValidaciones'][i].puntaje)
              }
                
                break;
              case "Mayor":
                
                if (rptPreguntas.NUMERO_HIJOS>parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }

                break;
              case "Igual":
                
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":

                if (rptPreguntas.NUMERO_HIJOS>=parseInt(validacion['DosValidaciones'][i].inicio) &&  rptPreguntas.NUMERO_HIJOS<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
                break;  
              default:
                break;
            }

          }

          //////////////////////////console.log("SCORE "+i+" :"+score)
          break;
        case 13:
        
          validacion=this.lista40Preguntas['EVALUACION_CREDITICIA'][i]['ESTADO_VEHICULO']
          //1 VALIDACION
          for (let i = 0; i < validacion['UnaValidaciones'].length; i++) {

            if (validacion['UnaValidaciones'][i].subCaracteristica==rptPreguntas.ESTADO_VEHICULO) {
              switch (validacion['UnaValidaciones'][i].tipoValidacion) {
                case "Hasta":
  
                if (rptPreguntas.ESTADO_VEHICULO<=validacion['UnaValidaciones'][i].fin) {
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                }
                  
                  break;
                case "Mayor":
                  
                  if (rptPreguntas.ESTADO_VEHICULO>validacion['UnaValidaciones'][i].fin) {
                    score=score+(validacion['UnaValidaciones'][i].puntaje)
                  }
  
                  break;
                case "Igual":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break;  
                case "Comparar":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break; 
                case "Rangos":
                  
                  break;  
                default:
                  break;
              }
            }

          }

          //2 VALIDACIONES
          for (let i = 0; i < validacion['DosValidaciones'].length; i++) {

            switch (validacion['DosValidaciones'][i].tipoValidacion) {
              case "Hasta":

              if (rptPreguntas.ESTADO_VEHICULO<=parseInt(validacion['DosValidaciones'][i].fin)) {
                score=score+(validacion['DosValidaciones'][i].puntaje)
              }
                
                break;
              case "Mayor":
                
                if (rptPreguntas.ESTADO_VEHICULO>parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }

                break;
              case "Igual":
                
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":

                if (rptPreguntas.ESTADO_VEHICULO>=parseInt(validacion['DosValidaciones'][i].inicio) &&  rptPreguntas.ESTADO_VEHICULO<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
                break;  
              default:
                break;
            }

          }
          //////////////////////////console.log("SCORE "+i+" :"+score)
          break;
        case 14:
          
          validacion=this.lista40Preguntas['EVALUACION_CREDITICIA'][i]['VIVIENDA_VENC_CONTRATO']
          //1 VALIDACION
          var datosViviendaVencContrato=rptPreguntas.VIVIENDA_VENC_CONTRATO.split("-")
          for (let i = 0; i < validacion['UnaValidaciones'].length; i++) {

            if (validacion['UnaValidaciones'][i].subCaracteristica==datosViviendaVencContrato[0]) {
              switch (validacion['UnaValidaciones'][i].tipoValidacion) {
                case "Hasta":
  
                  if (validacion['UnaValidaciones'][i].tipoDato==datosViviendaVencContrato[2]) {
                    if (datosViviendaVencContrato[1]<=validacion['UnaValidaciones'][i].fin) {
                      score=score+(validacion['UnaValidaciones'][i].puntaje)
                    }
                  }
                
                  
                  break;
                case "Mayor":
                  
                  if (validacion['UnaValidaciones'][i].tipoDato==datosViviendaVencContrato[2]) {
                    if (datosViviendaVencContrato[1]>validacion['UnaValidaciones'][i].fin) {
                      score=score+(validacion['UnaValidaciones'][i].puntaje)
                    }
                  }
                  
  
                  break;
                case "Menor":
                
                  if (validacion['UnaValidaciones'][i].tipoDato==datosViviendaVencContrato[2]) {
                    if (datosViviendaVencContrato[1]<validacion['UnaValidaciones'][i].fin) {
                      score=score+(validacion['UnaValidaciones'][i].puntaje)
                    }
                  }
                break;
                case "Igual":
                  if (validacion['UnaValidaciones'][i].tipoDato==datosViviendaVencContrato[2]) {
                    score=score+(validacion['UnaValidaciones'][i].puntaje)
                  }
                  break;  
                case "Comparar":
                  if (validacion['UnaValidaciones'][i].tipoDato==datosViviendaVencContrato[2]) {
                    score=score+(validacion['UnaValidaciones'][i].puntaje)
                  }
                  
                  break; 
                case "Rangos":
                  
                  break; 
                 
                default:
                  break;
              }
            }

          }

          //2 VALIDACIONES
          for (let i = 0; i < validacion['DosValidaciones'].length; i++) {

            if (validacion['DosValidaciones'][i].subCaracteristica==datosViviendaVencContrato[0]) {

              
            switch (validacion['DosValidaciones'][i].tipoValidacion) {
              case "Hasta":

                if (validacion['DosValidaciones'][i].tipoDato==datosViviendaVencContrato[2]) {
                  if (datosViviendaVencContrato[1]<=parseInt(validacion['DosValidaciones'][i].fin)) {
                    score=score+(validacion['DosValidaciones'][i].puntaje)
                  }
                }

              
                
                break;
              case "Mayor":
                
                if (validacion['DosValidaciones'][i].tipoDato==datosViviendaVencContrato[2]) {
                  if (datosViviendaVencContrato[1]>parseInt(validacion['DosValidaciones'][i].fin)) {
                    score=score+(validacion['DosValidaciones'][i].puntaje)
                  }
                }
                
                break;

                case "Menor":
                
                if (validacion['DosValidaciones'][i].tipoDato==datosViviendaVencContrato[2]) {
                  if (datosViviendaVencContrato[1]<=parseInt(validacion['DosValidaciones'][i].fin)) {
                    score=score+(validacion['DosValidaciones'][i].puntaje)
                  }
                }
                
                break;
              case "Igual":
                
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":

              if (validacion['DosValidaciones'][i].tipoDato==datosViviendaVencContrato[2]) {
                if (datosViviendaVencContrato[1]>=parseInt(validacion['DosValidaciones'][i].inicio) &&  datosViviendaVencContrato[1]<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
              }
                
                break;  
              
              case "Mayor-Hasta":

                if (datosViviendaVencContrato[1]>parseInt(validacion['DosValidaciones'][i].inicio) &&  datosViviendaVencContrato[1]<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
                break; 
              default:
                break;
            }


            }

          }
          //////////////////////////console.log("SCORE "+i+" :"+score)
          break;
        case 15:
          
        
          validacion=this.lista40Preguntas['EVALUACION_CREDITICIA'][i]['PROPIEDAD_SERVICIO']
          //1 VALIDACION
          for (let i = 0; i < validacion['UnaValidaciones'].length; i++) {

            if (validacion['UnaValidaciones'][i].subCaracteristica==rptPreguntas.PROPIEDAD_SERVICIO) {
              switch (validacion['UnaValidaciones'][i].tipoValidacion) {
                case "Hasta":
  
                if (rptPreguntas.PROPIEDAD_SERVICIO<=validacion['UnaValidaciones'][i].fin) {
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                }
                  
                  break;
                case "Mayor":
                  
                  if (rptPreguntas.PROPIEDAD_SERVICIO>validacion['UnaValidaciones'][i].fin) {
                    score=score+(validacion['UnaValidaciones'][i].puntaje)
                  }
  
                  break;
                case "Igual":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break;  
                case "Comparar":
                  score=score+(validacion['UnaValidaciones'][i].puntaje)
                  break; 
                case "Rangos":
                  
                  break;  
                default:
                  break;
              }
            }

          }

          //2 VALIDACIONES
          for (let i = 0; i < validacion['DosValidaciones'].length; i++) {

            switch (validacion['DosValidaciones'][i].tipoValidacion) {
              case "Hasta":

              if (rptPreguntas.PROPIEDAD_SERVICIO<=parseInt(validacion['DosValidaciones'][i].fin)) {
                score=score+(validacion['DosValidaciones'][i].puntaje)
              }
                
                break;
              case "Mayor":
                
                if (rptPreguntas.PROPIEDAD_SERVICIO>parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }

                break;
              case "Igual":
                
                break;  
              case "Comparar":
                
                break; 
              case "Rangos":

                if (rptPreguntas.PROPIEDAD_SERVICIO>=parseInt(validacion['DosValidaciones'][i].inicio) &&  rptPreguntas.PROPIEDAD_SERVICIO<=parseInt(validacion['DosValidaciones'][i].fin)) {
                  score=score+(validacion['DosValidaciones'][i].puntaje)
                }
                
                break;  
              default:
                break;
            }

          }
          //////////////////////////console.log("SCORE "+i+" :"+score)
          break;
          
      
        default:
          break;
      }

    }
    //////////////////////////console.log("El score es: "+score);
    SolicitudFinanciamiento.numeroScore=score;
    //////////////////////////console.log("REGISTRO SOLICITUD FINANCIAMIENTO: "+JSON.stringify(SolicitudFinanciamiento))
    this.registrarDatos(SolicitudFinanciamiento);
  }


  obtenerProductosPorTipoNumDoc(idTipoDocumento:number,numDocumento:string){
    try {
      //////////////////////console.log(idTipoDocumento,numDocumento)
      this.financiamientoService.getListProductByTipoNumDoc(idTipoDocumento,numDocumento).subscribe(resp =>{
        
        this.listProductoPorCliente=resp;
        // //////////////////////console.log("PRODUCTOS PREEVALUACIONES: "+JSON.stringify(this.listProductoPorCliente))
        if (Object.keys(this.listProductoPorCliente).length === 0) {
          // //////////////////////////console.log("NO TIENE PREEVALUACIONES")
          this.flagPreevaluacion=false;
        }else{
          // //////////////////////////console.log("TIENE PREEVALUACIONES")
          //this.flagPreevaluacion=true;
          this.flagPreevaluacion=false;
        }

        this.abrirPendientesFinanciamiento(idTipoDocumento,numDocumento);
      });
    } catch (error) {
      
    }
  }
  obtener(provincia){
    this.distritoCombo = provincia.value.distrito;
  }
  obtenerDatosGeneralesCliente(){
    try {
      var idUsuario=this.datosCliente.id;

      this.mantenimientoService.getUsuarioPorId(idUsuario).subscribe(resp =>{

        this.datosUsuario=resp[0];
        

        console.log("obtenerDatosGeneralesCliente: "+JSON.stringify(this.datosUsuario))
        if (this.datosUsuario.estadoCivil==0) {
          this.firstFormGroup.patchValue({
            nombres:this.datosUsuario.nomCliente,
            apellidos:this.datosUsuario.apeCliente,
            dni:this.datosUsuario.numeroDocumento,
            fechaNacimiento:this.datePipe.transform(this.datosUsuario.fechaNacimiento,'yyyy-MM-dd'),
            correo:this.datosUsuario.usuarioEmail,
            celular:this.datosUsuario.telefonoMovil,
            direccion:this.datosUsuario.direccionResidencia
          })
          this.thirdFormGroup.patchValue({
            distrito:'Lima',
            direccion:this.datosUsuario.direccionResidencia,
          })
        }else{
          this.firstFormGroup.patchValue({
            nombres:this.datosUsuario.nomCliente,
            apellidos:this.datosUsuario.apeCliente,
            dni:this.datosUsuario.numeroDocumento,
            fechaNacimiento:this.datePipe.transform(this.datosUsuario.fechaNacimiento,'yyyy-MM-dd'),
            estadoCivil:this.datosUsuario.estadoCivil,
            correo:this.datosUsuario.usuarioEmail,
            celular:this.datosUsuario.telefonoMovil,
            direccion:this.datosUsuario.direccionResidencia,
            
          })
          
          this.thirdFormGroup.patchValue({
            distrito:'Lima',
            direccion:this.datosUsuario.direccionResidencia,
          })
        }

        this.obtenerUltimoFinanciamiento(idUsuario);
        

        this.obtenerProductosPorTipoNumDoc(this.datosUsuario.idTipoDocumento,this.datosUsuario.numeroDocumento)
        this.cargarTablaFinanciamiento();
      });
    } catch (error) {
      
    }
  }

  obtenerUltimoFinanciamiento(idUsuario:number){
    this.financiamientoService.getUltimoFinanciamiento(idUsuario).subscribe(resp =>{

    
      this.firstFormGroup.patchValue({
        /* nombres:this.datosUsuario.nomCliente,
        apellidos:this.datosUsuario.apeCliente,
        dni:this.datosUsuario.numeroDocumento,
        fechaNacimiento:this.datePipe.transform(this.datosUsuario.fechaNacimiento,'yyyy-MM-dd'), */
        /* estadoCivil:resp.estadoCivil, */
        correo:this.datosUsuario.usuarioEmail,
        celular:this.datosUsuario.telefonoMovil,
        /* nivelEstudios:resp.idNivelEstudios */
      })
      
      for (let i = 0; i < Object.keys(this.listEstadoCivil).length; i++) {
        if (this.listEstadoCivil[i].id==resp.estadoCivil.toString()) {
          console.log(this.listEstadoCivil[i])
          this.firstFormGroup.patchValue({
            estadoCivil :this.listEstadoCivil[i]
          })
          this.opcionSeleccionado('3',this.listEstadoCivil[i])
          break; 
        }
      }
      
      for (let i = 0; i < Object.keys(this.listDireccionModel).length; i++) {
        if (this.listDireccionModel[i].distrito==resp.distrito.toString()) {
          
          this.thirdFormGroup.patchValue({
            distrito :this.listDireccionModel[i]
          })
          this.opcionSeleccionado('5',this.listDireccionModel[i])
          break; 
        }
      }
      for (let i = 0; i < Object.keys(this.listNivelEstudios).length; i++) {
        if (this.listNivelEstudios[i].id==resp.idNivelEstudios.toString()) {
          console.log(this.listNivelEstudios[i])
          this.firstFormGroup.patchValue({
            nivelEstudios :this.listNivelEstudios[i]
          })
          this.opcionSeleccionado('1',this.listNivelEstudios[i])
          break; 
        }
      }

      this.thirdFormGroup.patchValue({
        referencias:resp.referenciaDomicilio,
        mzLt:resp.mzLt,
        numInterior:resp.numeroInterior
      })

    });
  }

  obtenerDatosProducto(data){
    console.log("DATOS: "+JSON.stringify(data))
    this.productoSeleccionado=data;
    console.log(this.productoSeleccionado)
    this.fifthFormGroup.patchValue({
      nombProducto:data,
      nombProveedor:data.proveedor,
      nombEstablecimiento:data.proveedor,
      nombPrecio:data.precio.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }).replace("$","S/ ")
    })

    this.fourthFormGroup.patchValue({
      placa:data.numPlaca
    })


    // alert(this.productoSeleccionado.idProveedorProducto)
    this.thirdFormGroup.patchValue({
      fl_Producto:data
    })
    
    // this.fifthFormGroup.get('nombProveedor').value;
    // this.fifthFormGroup.get('nombPrecio').value;
    this.idPreevaluacion=data.idPreevaluacion;

    this.flagDuenioVehiculo=data.indPropietarioVehiculo;

  }

  SolicitudPreevaluacion(): void{
    // this.authorizesService.redirectSolicitudPreevaluacion();
    var url=document.location.origin+"/solicitud-preevaluacion"
    var win = window.open(url, '_blank');
    // Cambiar el foco al nuevo tab (punto opcional)
    win.focus();
  }

  obtenerDistrito(){
    this.ubigeoService.getDistrito("1501").subscribe(resp=>{
      this.listaDistrito = resp;
      this.listDireccionModel=resp;
    });
  }
  obtenerTalleres(){
    // //////////////////////console.log(this.productoSeleccionado.idProveedorProducto)
    this.financiamientoService.getListTalleres(this.inputConsulta,this.productoSeleccionado.idProveedorProducto,this.productoSeleccionado.idTipoProducto).subscribe(resp =>{
      // //////////////////////////console.log(resp)
       this.listTalleres  = resp ;
       //Si hay datos buscados false sino true
       this.sinDatos = resp != '' ? false : true;
    });
  }

  obtenerNivelesEstudio(){
    this.financiamientoService.getEstadoNivelEstudiosCliente().subscribe(resp =>{
       this.listNivelEstudios  = resp ;
    });
  }
  obtenerEstadoCivil(){
    this.financiamientoService.getEstadoCivilCliente().subscribe(resp =>{
       this.listEstadoCivil  = resp ;
    });
  }
  obtenerTipoCalle(){
    this.financiamientoService.getTipoCalle().subscribe(resp =>{
       this.listTipoCalle  = resp ;
      //  //////////////////////////console.log("LISTA TIPO CALLE:"+JSON.stringify(this.listTipoCalle));
    });
  }
  obtenerEstadoVehicular(){
    this.financiamientoService.getEstadoVehicular().subscribe(resp =>{
       this.listEstadoVehicular  = resp ;
    });
  }
  obtenerTipoFinanciamiento(){
    this.financiamientoService.getTipoFinanciamiento().subscribe(resp =>{
       this.listTipoFinanciamiento  = resp ;
    });
  }
  obtenerTipoCreditoFinanciamiento(){
    this.financiamientoService.getTipoCreditoFinanciamiento().subscribe(resp =>{
       this.listTipoCreditoFinanciamiento  = resp ;
    });
  }

  obtnerDatosUSerLogeado(){
    this.datosCliente = this.authorizesService.getUserAuth();
    
  }

  filtrar(){
    this.inputConsulta = this.sixthFormGroup.get('inputFilter').value;
    this.obtenerTalleres();
  }

  crearFormulario1() {
    this.firstFormGroup = this.formBuilder.group({
      nombres :['', [Validators.required, Validators.pattern(ExpressionValidation.LetterSpace)]],
      apellidos :['', [Validators.required, Validators.pattern(ExpressionValidation.LetterSpace)]],
      dni : ['', [Validators.required, Validators.pattern(ExpressionValidation.Dni), Validators.minLength(8), Validators.maxLength(8)]],
      // fechaEmision :['', Validators.required],
      fechaNacimiento :['', Validators.required],
      estadoCivil :['', Validators.required],
      correo :['', [Validators.required, Validators.email]],
      celular :['', [Validators.required, Validators.pattern(ExpressionValidation.Celular), Validators.minLength(9), Validators.maxLength(9)]],
      nivelEstudios :['', Validators.required],
      direccion:['']
    });
  }
  validarForm1(){
    if(this.firstFormGroup.valid) return true;
    else{
      let errors = [];

      if (this.firstFormGroup.get('nombres').hasError('required')) errors.push('Ingrese nombres.');
      else if (!this.firstFormGroup.get('nombres').valid) errors.push('Ingrese nombres con el formato correcto.');

      if (this.firstFormGroup.get('apellidos').hasError('required')) errors.push('Ingrese apellidos.');
      else if (!this.firstFormGroup.get('apellidos').valid) errors.push('Ingrese apellidos con el formato correcto.');

      if (this.firstFormGroup.get('dni').hasError('required')) errors.push('Ingrese DNI.');
       else if (!this.firstFormGroup.get('dni').valid) errors.push('Ingrese DNI con el formato correcto.');

      // if (this.firstFormGroup.get('fechaEmision').hasError('required')) errors.push('Ingrese fecha de emisión.');
      if (this.firstFormGroup.get('fechaNacimiento').hasError('required')) errors.push('Ingrese fecha de nacimiento.');
      if (this.firstFormGroup.get('estadoCivil').hasError('required')) errors.push('Ingrese estado Civil.');

      if (this.firstFormGroup.get('correo').hasError('required')) errors.push('Ingrese un correo electrónico.');
			else if (!this.firstFormGroup.get('correo').valid) errors.push('Ingrese un correo electrónico válido.');

      if (this.firstFormGroup.get('nivelEstudios').hasError('required')) errors.push('Ingrese nivel de estudios.');

      this.commonService.getErrorHtmlList(errors);
			return false;
    }

  }

  crearFormulario2() {
    this.secondFormGroup = this.formBuilder.group({
      radOcupacion :['', Validators.required],
      radContrato :['', Validators.required],
      radTiempo :['', Validators.required],
      tiempoEmpleo :['', Validators.required],
      ingMensuales :['',Validators.required],
      numHijos :['',Validators.required]
    });
  }
  validarForm2(){
    if(this.secondFormGroup.valid) return true;
    else{
      let errors = [];

      if (this.secondFormGroup.get('radOcupacion').hasError('required')) errors.push('Seleccione ocupación.');
      if (this.secondFormGroup.get('radContrato').hasError('required')) errors.push('Seleccione contrato temporal o indeterminado.');
      if (this.secondFormGroup.get('radTiempo').hasError('required')) errors.push('Seleccione tiempo en el actual empleo');
      if (this.secondFormGroup.get('tiempoEmpleo').hasError('required')) errors.push('Ingrese tiempo que lleva en su actual empleo.');
      if (this.secondFormGroup.get('ingMensuales').hasError('required')) errors.push('Ingrese promedio de ingresos mensuales.');
      if (this.secondFormGroup.get('numHijos').hasError('required')) errors.push('Ingrese el número de hijos.');

      this.commonService.getErrorHtmlList(errors);
			return false;
    }
  }

  crearFormulario3() {
  this.thirdFormGroup = this.formBuilder.group({
      radTipoCalle :['', Validators.required],
      otraCalle :[''],
      direccion :['', Validators.required],
      numInterior :['', Validators.required],
      mzLt :[''],
      distrito :['', Validators.required],
      referencias :['', Validators.required],
      radTipoVivienda :['', Validators.required],
      aniosVivienda :['', Validators.required],
      mesesContrato :[''],
      radTieneGas :['', Validators.required],
      fl_Producto :['', Validators.required],
    });
  }
  validarForm3(){
    if(this.thirdFormGroup.valid) return true;
    else{
      let errors = [];

      if (this.thirdFormGroup.get('radTipoCalle').hasError('required')) errors.push('Seleccione tipo calle.');
      if (this.thirdFormGroup.get('direccion').hasError('required')) errors.push('Ingrese dirección.');
      if (this.thirdFormGroup.get('numInterior').hasError('required')) errors.push('Ingrese Nº de interior.');
     /*  if (this.thirdFormGroup.get('mzLt').hasError('required')) errors.push('Ingrese Mz / Lt.'); */
      if (this.thirdFormGroup.get('distrito').hasError('required')) errors.push('Ingrese distrito.');
      if (this.thirdFormGroup.get('referencias').hasError('required')) errors.push('Ingrese una referencia.');
      if (this.thirdFormGroup.get('radTipoVivienda').hasError('required')) errors.push('Seleccione tipo de vivienda.');
      if (this.thirdFormGroup.get('aniosVivienda').hasError('required')) errors.push('Ingrese tiempo que lleva viviendo en la vivienda.');
      if (this.thirdFormGroup.get('mesesContrato').hasError('required')) errors.push('Ingrese en cuantos meses vence su contrato .');
      if (this.thirdFormGroup.get('radTieneGas').hasError('required')) errors.push('Seleccione si cuenta con gas natural .');
      if (this.thirdFormGroup.get('fl_Producto').hasError('required')) errors.push('Seleccione un producto.');

      this.commonService.getErrorHtmlList(errors);
      

      
			return false;
    }
  }


  crearFormulario4() {
    this.fourthFormGroup = this.formBuilder.group({
      placa :['', Validators.required],
      marcAuto :['', Validators.required],
      modeloAuto :['', Validators.required],
      anioFabricacion :['', Validators.required],
      // tarjetaProp :['', Validators.required],
      // cilindraMotor :['', Validators.required],
      radUsoVehiculo :['', Validators.required],
      radEstadoVehiculo :['', Validators.required],
    });
  }
  validarForm4(){
    if(this.fourthFormGroup.valid) return true;
    else{
      let errors = [];

      if (this.fourthFormGroup.get('placa').hasError('required')) errors.push('Ingrese placa del auto.');
      if (this.fourthFormGroup.get('marcAuto').hasError('required')) errors.push('Ingrese marca del auto.');
      if (this.fourthFormGroup.get('modeloAuto').hasError('required')) errors.push('Ingrese modelo del auto.');
      if (this.fourthFormGroup.get('anioFabricacion').hasError('required')) errors.push('Ingrese año de fabricación del auto.');
      // if (this.fourthFormGroup.get('tarjetaProp').hasError('required')) errors.push('Ingrese tarjeta de propiedad del auto.');
      // if (this.fourthFormGroup.get('cilindraMotor').hasError('required')) errors.push('Ingrese tipo de cilindra del motor.');
      if (this.fourthFormGroup.get('radUsoVehiculo').hasError('required')) errors.push('Seleccione como usa su vehículo.');
      if (this.fourthFormGroup.get('radEstadoVehiculo').hasError('required')) errors.push('Seleccione un estado del vehículo.');
      
      this.commonService.getErrorHtmlList(errors);
			return false;
    }
  }
  
  crearFormulario5() {
    this.fifthFormGroup = this.formBuilder.group({
      nombProducto:[{value:'', disabled: true}, Validators.required],
      nombProveedor:['', Validators.required],
      nombPrecio:['', Validators.required],
      nombEstablecimiento :['', Validators.required],
      radReqFinanciamiento :['', Validators.required],
      inputOtras :[''],
      radTipoCredito :['', Validators.required],
      radPlazoMaximo :['', Validators.required],
      montFinanciar :[''],
      observacion :[''],
    });
  }
  validarForm5(){
    if(this.fifthFormGroup.valid) return true;
    else{
      let errors = [];

      if (this.fifthFormGroup.get('nombEstablecimiento').hasError('required')) errors.push('Ingrese Nombre del establecimiento.');
      if (this.fifthFormGroup.get('radReqFinanciamiento').hasError('required')) errors.push('Seleccione requiere financiamiento.');
      if (this.fifthFormGroup.get('radTipoCredito').hasError('required')) errors.push('Seleccione tipo de crédito.');
      if (this.fifthFormGroup.get('radPlazoMaximo').hasError('required')) errors.push('Seleccione plazo máximo en el que pagará el financiamiento.');
      //if (this.fifthFormGroup.get('montFinanciar').hasError('required')) errors.push('Ingrese monto a financiar.');

      this.commonService.getErrorHtmlList(errors);
			return false;
    }
  }

  crearFormulario6() {
    this.sixthFormGroup = this.formBuilder.group({
      inputFilter :[''],
      radTaller :['',Validators.required],
    });
  }

  validarForm6(){
    if(this.sixthFormGroup.valid) return true;
    else{
      let errors = [];

      if (this.sixthFormGroup.get('radTaller').hasError('required')) errors.push('Selecciona un taller.');
      this.commonService.getErrorHtmlList(errors);
			return false;
    }
  }

  crearFormulario7() {
    this.seventhFormGroup = new FormGroup({
      fileFormDatos : new FormControl(Validators.required),
      // checkFormDatos : new FormControl(),
      fileContrFinanciamiento : new FormControl(Validators.required),
      checkDNI: new FormControl(false),
      checkContrFinanciamiento : new FormControl(false),
      tconformidad : new FormControl(undefined,Validators.required),
      tpoliticasCondiciones : new FormControl(undefined,Validators.required),
      digitoVerificador : new FormControl('',Validators.required),
   });
  }

  validarForm7(){
    if(this.seventhFormGroup.valid) {
      let errors = [];
      if (this.seventhFormGroup.value.tconformidad==false) {
        errors.push('Debe aceptar el contenido del contrato y dar conformidad .');
        this.seventhFormGroup.patchValue({
          tconformidad:undefined
        })
      }

      if (this.seventhFormGroup.value.tpoliticasCondiciones==false) {
        errors.push('Debe aceptar los términos y condiciones .');
        this.seventhFormGroup.patchValue({
          tpoliticasCondiciones:undefined
        })
      }

      if (errors.length==0) {
        return true
      }else{
        this.commonService.getErrorHtmlList(errors);
			return false;
      }
    }
    else{
      let errors = [];

      if (this.seventhFormGroup.get('tconformidad').hasError('required')) errors.push('Debe aceptar el contenido del contrato y dar conformidad .');
      if (this.seventhFormGroup.get('tpoliticasCondiciones').hasError('required')) errors.push('Debe aceptar los términos y condiciones .');
      this.commonService.getErrorHtmlList(errors);
			return false;
    }
  }


  crearFormulario8() {
    this.eighthFormGroup = new FormGroup({
      //fileDni : new FormControl(),
      // fileHud : new FormControl(),
      // fileTarjProp : new FormControl(),
      // filePermiso : new FormControl(),
      // fileLicencia : new FormControl(),
      // fileRecibo : new FormControl(),
      // fileRevTecnica : new FormControl(),
      //fileSoat : new FormControl(),
      // fileContratoFinc : new FormControl(),
      //fileFormConformidad : new FormControl(Validators.required),
      //checkFormDniVendedor : new FormControl(false),
      //digitoVerificador : new FormControl(),
      fileTPFrontal : new FormControl(),
      fileTPPosterior : new FormControl(),
      fileCInformado : new FormControl(),
      fileDVCInformado : new FormControl(),
      fileSoat : new FormControl(),
   });
  }



  //Upload Formulario 7
  uploadFileFormDatos(event,nombrecampo:string) {
    //////////////////////////console.log(event);
    this.transformarBase64(event.target,nombrecampo)
    // this.nobFileFormDatos = event.target.files[0].name;
    // //////////////////////////console.log(event.target.files[0].name);
  }


  validateFirstFormGroup(){
    if(this.validarForm1()){
     this.form1LLeno = true;
    }else{
      this.form1LLeno = false;
    }
    //////////////////////////console.log(this.firstFormGroup)
  }
  validateSecondFormGroup(){
    if(this.validarForm2()){
      this.form2LLeno = true;
    }else{
      this.form2LLeno = false;
    }
  }
  validateThirdFormGroup(){
    if(this.validarForm3()){
      this.form3LLeno = true;

      this.fifthFormGroup.patchValue({
        radReqFinanciamiento:this.productoSeleccionado.idTipoProducto
      })

      if (this.productoSeleccionado.idTipoProducto==1) {

        
        this.fourthFormGroup.get('placa').setValidators([Validators.required]); // or clearValidators()
        this.fourthFormGroup.get('placa').updateValueAndValidity();

        this.fourthFormGroup.get('marcAuto').setValidators([Validators.required]); // or clearValidators()
        this.fourthFormGroup.get('marcAuto').updateValueAndValidity();

        this.fourthFormGroup.get('modeloAuto').setValidators([Validators.required]); // or clearValidators()
        this.fourthFormGroup.get('modeloAuto').updateValueAndValidity();

        this.fourthFormGroup.get('anioFabricacion').setValidators([Validators.required]); // or clearValidators()
        this.fourthFormGroup.get('anioFabricacion').updateValueAndValidity();

        this.fourthFormGroup.get('radUsoVehiculo').setValidators([Validators.required]); // or clearValidators()
        this.fourthFormGroup.get('radUsoVehiculo').updateValueAndValidity();

        this.fourthFormGroup.get('radEstadoVehiculo').setValidators([Validators.required]); // or clearValidators()
        this.fourthFormGroup.get('radEstadoVehiculo').updateValueAndValidity();

        this.secondFormGroup.get('ingMensuales').setValidators([Validators.required]); // or clearValidators()
        this.secondFormGroup.get('ingMensuales').updateValueAndValidity();

        this.secondFormGroup.get('numHijos').setValidators([Validators.required]); // or clearValidators()
        this.secondFormGroup.get('numHijos').updateValueAndValidity();

        if (Object.keys(this.productoSeleccionado).length<=0) {
          this.disabledProductoCombo=false
        }else{
          this.disabledProductoCombo=true
        }

        this.ocultarTaller=false;

        this.obtenerTalleres();

        if (this.flagTemporal) {
          this.fifthFormGroup.patchValue({
            radTaller : this.solFinanciamientoTempModel.idTaller
          })
        }

        var precioTotal=parseInt(this.fifthFormGroup.get('nombPrecio').value.replace("S/","").trim());
        this.cantidadDigitos=precioTotal.toString().length

      }else{

       

        this.fourthFormGroup.get('placa').setValidators([]); // or clearValidators()
        this.fourthFormGroup.get('placa').updateValueAndValidity();

        this.fourthFormGroup.get('marcAuto').setValidators([]); // or clearValidators()
        this.fourthFormGroup.get('marcAuto').updateValueAndValidity();

        this.fourthFormGroup.get('modeloAuto').setValidators([]); // or clearValidators()
        this.fourthFormGroup.get('modeloAuto').updateValueAndValidity();

        this.fourthFormGroup.get('anioFabricacion').setValidators([]); // or clearValidators()
        this.fourthFormGroup.get('anioFabricacion').updateValueAndValidity();

        this.fourthFormGroup.get('radUsoVehiculo').setValidators([]); // or clearValidators()
        this.fourthFormGroup.get('radUsoVehiculo').updateValueAndValidity();

        this.fourthFormGroup.get('radEstadoVehiculo').setValidators([]); // or clearValidators()
        this.fourthFormGroup.get('radEstadoVehiculo').updateValueAndValidity();

        this.secondFormGroup.get('ingMensuales').setValidators([]); // or clearValidators()
        this.secondFormGroup.get('ingMensuales').updateValueAndValidity();

        this.secondFormGroup.get('numHijos').setValidators([]); // or clearValidators()
        this.secondFormGroup.get('numHijos').updateValueAndValidity();

        this.stepper.linear = false;
        this.stepper.selectedIndex = 3;
        setTimeout(() => {
          this.stepper.linear = true;
        });

        this.disabledProductoCombo=true
        
        this.ocultarTaller=true;

        var precioTotal=parseInt(this.fifthFormGroup.get('nombPrecio').value.replace("S/","").trim());
        this.cantidadDigitos=precioTotal.toString().length

        this.form4LLeno = true;
        this.form6LLeno = true;

      }
    }else{

        var precioTotal=parseInt(this.fifthFormGroup.get('nombPrecio').value.replace("S/","").trim());
        this.cantidadDigitos=precioTotal.toString().length

      this.form3LLeno = false;
    }
  }
  validateFourthFormGroup(){
    if(this.validarForm4()){
      this.form4LLeno = true;
    }else{
      this.form4LLeno = false;
    }
  }
  validateFifthFormGroup(){
    if(this.validarForm5()){
      this.form5LLeno = true;
    }else{
      this.form5LLeno = false;
    }
  }
  validateSixthFormGroup(){
    if(this.validarForm6()){
      this.form6LLeno = true;
    }else{
      this.form6LLeno = false;
    }
  }
  validateSeventhFormGroup(){
    if(this.validarForm7()){
      this.form7LLeno = true;
    }else{
      this.form7LLeno = false;
    }
  }


  getEdad(dateString):number {
    let hoy = new Date()
    let fechaNacimiento = new Date(dateString)
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
    let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()
    if (
      diferenciaMeses < 0 ||
      (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
    ) {
      edad--
    }
    // alert(edad)
    return edad
  }

  guardarDatos(){
    //////////////////////console.log(this.form1LLeno)
    //////////////////////console.log(this.form2LLeno)
    //////////////////////console.log(this.form3LLeno)
    //////////////////////console.log(this.form4LLeno)
    //////////////////////console.log(this.form5LLeno)
    //////////////////////console.log(this.form6LLeno)
    
    //Si todos los formularios estan llenos
    if(this.form1LLeno && this.form2LLeno && this.form3LLeno && this.form4LLeno && this.form5LLeno && this.form6LLeno){


      
      this.solFinanciamientoModel.idSfClientetemp                  = this.idSfCliente;
       this.solFinanciamientoModel.idCliente                  = Number(this.datosCliente.id);

       this.solFinanciamientoModel.nombres                    = this.firstFormGroup.get('nombres').value;
       this.solFinanciamientoModel.apellidos                  = this.firstFormGroup.get('apellidos').value;
       this.solFinanciamientoModel.numeroDocumento            = String(this.firstFormGroup.get('dni').value);
       this.solFinanciamientoModel.codUbigeo                  = '';
       //this.solFinanciamientoModel.fechaEmision               = this.firstFormGroup.get('fechaEmision').value;
       this.solFinanciamientoModel.fechaNacimiento            = this.firstFormGroup.get('fechaNacimiento').value;
       this.solFinanciamientoModel.estadoCivil                = this.comboEstadoCivil.id;
       this.solFinanciamientoModel.correoElectronico          = this.firstFormGroup.get('correo').value;
       this.solFinanciamientoModel.celular                    = String(this.firstFormGroup.get('celular').value);
       this.solFinanciamientoModel.idNivelEstudios            = this.comboNivelEstudio.id;

       this.solFinanciamientoModel.ocupacion                  = this.secondFormGroup.get('radOcupacion').value;
       this.solFinanciamientoModel.tipoContrato               = this.secondFormGroup.get('radContrato').value;
       this.solFinanciamientoModel.tiempoEmpleoCliente        = this.secondFormGroup.get('tiempoEmpleo').value;

       this.solFinanciamientoModel.tipoCalle                  = this.thirdFormGroup.get('radTipoCalle').value;
       this.solFinanciamientoModel.direccion                  = this.thirdFormGroup.get('direccion').value;
       this.solFinanciamientoModel.numeroInterior             = Number(this.thirdFormGroup.get('numInterior').value);
       this.solFinanciamientoModel.mzLt                       = this.thirdFormGroup.get('mzLt').value;
       this.solFinanciamientoModel.distrito                   = this.distritoCombo;
       this.solFinanciamientoModel.referenciaDomicilio        = this.thirdFormGroup.get('referencias').value;
       this.solFinanciamientoModel.tipoVivienda               = this.thirdFormGroup.get('radTipoVivienda').value;
       this.solFinanciamientoModel.tiempoAnoVivienda          = parseInt(this.thirdFormGroup.get('aniosVivienda').value);
       this.solFinanciamientoModel.tiempoMesesVivienda        = parseInt(this.thirdFormGroup.get('mesesContrato').value);
       this.solFinanciamientoModel.isGasNatural               = Boolean(this.thirdFormGroup.get('radTieneGas').value);

       this.solFinanciamientoModel.numeroPlaca                = this.fourthFormGroup.get('placa').value;
       this.solFinanciamientoModel.marcaAuto                  = this.fourthFormGroup.get('marcAuto').value;
       this.solFinanciamientoModel.modeloAuto                 = this.fourthFormGroup.get('modeloAuto').value;
       this.solFinanciamientoModel.fechaFabricacion           = new Date(this.fourthFormGroup.get('anioFabricacion').value + "-01-01");
      //  this.solFinanciamientoModel.numeroTarjetaPropiedad     = String(this.fourthFormGroup.get('tarjetaProp').value);
      //  this.solFinanciamientoModel.tipoCilindroMotor          = this.fourthFormGroup.get('cilindraMotor').value;
       this.solFinanciamientoModel.numeroTarjetaPropiedad     = "";
       this.solFinanciamientoModel.tipoCilindroMotor          = "";
       this.solFinanciamientoModel.tipoUsoVehicular           = Boolean(this.fourthFormGroup.get('radUsoVehiculo').value);
      //  this.solFinanciamientoModel.estadoVehiculo             = Number(this.fourthFormGroup.get('radEstadoVehiculo').value);

      this.solFinanciamientoModel.estadoVehiculo             = this.radioEstadoVehiculo.id
       this.solFinanciamientoModel.ingresoMensual             = String(this.secondFormGroup.get('ingMensuales').value);
       this.solFinanciamientoModel.numeroHijos                = parseInt(this.secondFormGroup.get('numHijos').value);

       this.solFinanciamientoModel.nombreEstablecimiento      = this.fifthFormGroup.get('nombEstablecimiento').value;
       this.solFinanciamientoModel.tipoFinanciamiento         = this.fifthFormGroup.get('radReqFinanciamiento').value;
       this.solFinanciamientoModel.tipoCredito                = Number(this.fifthFormGroup.get('radTipoCredito').value);
       this.solFinanciamientoModel.plazoCuotasFinanciamiento  = this.fifthFormGroup.get('radPlazoMaximo').value;
       //this.solFinanciamientoModel.montoFinanciamiento        = parseInt(this.fifthFormGroup.get('montFinanciar').value);
       this.solFinanciamientoModel.montoFinanciamiento        = this.productoSeleccionado.precio;
       this.solFinanciamientoModel.observaciones              = this.fifthFormGroup.get('observacion').value;

       this.solFinanciamientoModel.idTaller                   = Number(this.sixthFormGroup.get('radTaller').value);

       this.solFinanciamientoModel.numeroScore                =0;
       this.solFinanciamientoModel.idPreevaluacion            =this.idPreevaluacion;
       //this.solFinanciamientoModel.flagContratoFinanciamiento  =this.seventhFormGroup.get('checkContrFinanciamiento').value;
       //this.solFinanciamientoModel.flagFormatoConformidad      =false;
       this.solFinanciamientoModel.flagDNI                     =false;
       this.solFinanciamientoModel.digitoVerificadorDNI        =this.seventhFormGroup.get('digitoVerificador').value;
       //Nuevos campos word 4
       this.solFinanciamientoModel.flagFormatoConformidad                =this.seventhFormGroup.get('tconformidad').value;
       this.solFinanciamientoModel.FlagpoliticasCondiciones       =this.seventhFormGroup.get('tpoliticasCondiciones').value;
       this.solFinanciamientoModel.flagDNI                    =this.seventhFormGroup.get('checkDNI').value;
       this.solFinanciamientoModel.flagContratoFinanciamiento    =this.seventhFormGroup.get('checkContrFinanciamiento').value;
       this.solFinanciamientoModel.MesAnio    =this.secondFormGroup.get('radTiempo').value;

       this.fechaNacimiento=this.getEdad(this.solFinanciamientoModel.fechaNacimiento)
      this.fechaCreacion=this.getEdad(this.solFinanciamientoModel.fechaFabricacion)

      //  //////////////////////////console.log("DATOS GUARDAR SOLICITUD FINANCIAMIENTO: "+JSON.stringify(this.solFinanciamientoModel));
       this.armarScore(this.solFinanciamientoModel)
      //  this.registrarDatos();
      
    }else{
      //////////////////////////console.log(JSON.stringify(this.solFinanciamientoModel));
      //////////////////////////console.log('errrrrr')
      let errors = [];
      errors.push('Verifique que todos los datos solicitados estén llenados correctamente.');
      this.commonService.getErrorHtmlList(errors);
    }
  }

  registrarDatos(SolicitudFianciamiento:SolicitudFinanciamientoModel){
    console.log("registrarDatos: "+JSON.stringify(SolicitudFianciamiento))
    this.financiamientoService.postRegisterReglasKnockout(SolicitudFianciamiento).subscribe(resp =>{
      //////////////////////////console.log(resp)
      // ////////////////////////console.log("RESPUESTA postRegisterReglasKnockout: "+JSON.stringify(resp))
      // //////////////////////console.log("respuesta: "+JSON.stringify(resp))
      if (resp.valid) {
        this.messageSuccess.push(resp.message)

        this.guardarDocumentos(resp.idSfCliente,this.documentosBase64,this.messageSuccess)
        // this.commonService.getSuccessHtmlList(this.messageSuccess,'/gnv/solicitud-financiamiento');
      } else {
        let errors = [];
        errors.push('Se generó un error al registrar tus datos, intente nuevamente.');
        this.commonService.getErrorHtmlList(errors); 
      }
    })
  }

  registrarDatosTemporales(SolicitudFianciamiento:SolicitudFinanciamientoModel){
    console.log("registrarDatostemporal: "+JSON.stringify(SolicitudFianciamiento))
    this.financiamientoTemporalService.postRegisterReglasKnockoutTemp(SolicitudFianciamiento).subscribe(resp =>{
      //////////////////////////console.log(resp)
      // ////////////////////////console.log("RESPUESTA postRegisterReglasKnockout: "+JSON.stringify(resp))
      // //////////////////////console.log("respuesta: "+JSON.stringify(resp))
      if (resp.valid) {
        this.messageSuccess.push(resp.message)
        this.commonService.getSuccessHtmlList(this.messageSuccess,'/gnv/registro-solicitud-financiamiento');
      } else {
        let errors = [];
        errors.push('Se generó un error al registrar tus datos, intente nuevamente.');
        this.commonService.getErrorHtmlList(errors); 
      }
    })
  }

  opcionSeleccionado(combo:string,dato){
    // //////////////////////////console.log(combo)
    // //////////////////////////console.log(dato)

    switch (combo) {
      case '1':
        this.comboNivelEstudio=dato;
        break;
      case '2':
        
        break;
      case '3':
        this.comboEstadoCivil=dato;
        break;
      case '4':
        this.radioEstadoVehiculo=dato.value
        //////////////////////////console.log(this.radioEstadoVehiculo)
        break;
      case '5':
        this.comboDireccion=dato;
    
      default:
        break;
    }

  }




  armarScore(SolicitudFinanciamiento:SolicitudFinanciamientoModel){
    // alert(this.getEdad(SolicitudFinanciamiento.fechaNacimiento))
    var servicio="";
    //////////////////////////console.log(this.fechaNacimiento)
    //////////////////////////console.log(this.comboEstadoCivil.estado.trim())
    //////////////////////////console.log(this.comboNivelEstudio.estado.trim())
    //////////////////////////console.log(SolicitudFinanciamiento.tipoVivienda.trim())


    this.listaRespuestaFinanciamiento.EDAD=this.fechaNacimiento
    this.listaRespuestaFinanciamiento.ESTADO_CIVIL=this.comboEstadoCivil.estado.trim()
    this.listaRespuestaFinanciamiento.NIVEL_ESTUDIO=this.comboNivelEstudio.estado.trim()
    this.listaRespuestaFinanciamiento.TIPO_VIVIENDA=SolicitudFinanciamiento.tipoVivienda.trim()
    this.listaRespuestaFinanciamiento.TIEMPO_VIVIENDA=SolicitudFinanciamiento.tiempoAnoVivienda
    this.listaRespuestaFinanciamiento.OCUPACION=SolicitudFinanciamiento.ocupacion.trim()
    this.listaRespuestaFinanciamiento.ANTIGUEDAD_OCUPACION=SolicitudFinanciamiento.ocupacion.trim()+"-"+SolicitudFinanciamiento.tiempoEmpleoCliente+"-"+this.secondFormGroup.get('radTiempo').value;
    this.listaRespuestaFinanciamiento.TIPO_CONTRATO=SolicitudFinanciamiento.tipoContrato.trim()
    this.listaRespuestaFinanciamiento.OCUPACION_NIVEL_ESTUDIO=SolicitudFinanciamiento.ocupacion.trim()+"-"+this.comboNivelEstudio.estado.trim()
    this.listaRespuestaFinanciamiento.ANTIGUEDAD_VEHICULO=this.fechaCreacion.toString()+"-"+"Años"

    if (SolicitudFinanciamiento.tipoUsoVehicular) {
      servicio="Particular"
    }else{
      servicio="Publico"
    }
    this.listaRespuestaFinanciamiento.SERVICIO=servicio
    this.listaRespuestaFinanciamiento.INGRESOS_MENSUALES=parseInt(SolicitudFinanciamiento.ingresoMensual)
    this.listaRespuestaFinanciamiento.NUMERO_HIJOS=SolicitudFinanciamiento.numeroHijos
    this.listaRespuestaFinanciamiento.ESTADO_VEHICULO=(this.radioEstadoVehiculo.estado).indexOf("Nuevo")>= 0 ?"Nuevo":"Usado"
    this.listaRespuestaFinanciamiento.VIVIENDA_VENC_CONTRATO=SolicitudFinanciamiento.tipoVivienda+"-"+SolicitudFinanciamiento.tiempoMesesVivienda.toString()+"-"+"Meses"
    this.listaRespuestaFinanciamiento.PROPIEDAD_SERVICIO=(servicio).indexOf("Particular")>= 0 ? "Propio":"Puclico";

    // //////////////////////////console.log("JSON SCORE: "+JSON.stringify(this.listaRespuestaFinanciamiento))
    this.formulaScore(this.listaRespuestaFinanciamiento,SolicitudFinanciamiento);
  }

  


  orgValueChange(Fecha){
    //////////////////////////console.log(Fecha)
  }


  guardarDocumentos(idSfCliente:number,archivos:any,mensaje:any){

    this.cargaDocumentoSFModel.idCliente=idSfCliente
    this.cargaDocumentoSFModel.archivos=archivos

   //////////////////console.log("guardarDocumentos: "+JSON.stringify(this.cargaDocumentoSFModel))

    this.cargaDocumentoService.registrarCargaDocumentosSF(this.cargaDocumentoSFModel).subscribe(resp =>{

      //////////////////////////console.log("MENSAJE GUARDAR DOCS: "+JSON.stringify(resp))
      if (resp.valid) {
        // this.messageSuccess.push(resp.message)
        // this.commonService.getSuccessHtmlList(this.messageSuccess,'/gnv/solicitud-financiamiento');
        this.commonService.getSuccessHtmlList(mensaje,'/gnv/registro-solicitud-financiamiento');
      } else {
        let errors = [];
        errors.push('Se generó un error al guardar los documentos, intente nuevamente.');
        this.commonService.getErrorHtmlList(errors); 
      }

    })

  }


  transformarBase64(inputValue: any,nombrecampo:string): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();

    myReader.onloadend = (e) => {
      
      var separarTipoDato=myReader.result.toString().split("base64,")
      this.archivoBase64 = separarTipoDato[1];
      // //////////////////////////console.log(this.archivoBase64)

      
      var nombreProceso="SF";
      switch (nombrecampo) {
        case "fileTPFrontal":
          this.nombFileTPFrontal =inputValue.files[0].name;
          this.documentosBase64[0]={
            "fileName":this.nombFileTPFrontal,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileTPPosterior":
          this.nombFileTPPosterior = inputValue.files[0].name;

          this.documentosBase64[1]={
            "fileName":this.nombFileTPPosterior,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileCInformado":
          this.nombFileCInformado = inputValue.files[0].name;
          this.documentosBase64[2]={
            "fileName":this.nombFileCInformado,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileDVCInformado":
          this.nombFileDVCInformado = inputValue.files[0].name;
          this.documentosBase64[3]={
            "fileName":this.nombFileDVCInformado,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileSoat":
          this.nombFileSoat = inputValue.files[0].name;
          this.documentosBase64[4]={
            "fileName":this.nombFileSoat,
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
      //////////////////////////console.log("ARCHIVOS A BASE 64: "+JSON.stringify(this.documentosBase64))
      
    }
    myReader.readAsDataURL(file);
  }

  validacionesDocumentos(){
    // this.guardarDocumentos(id,this.documentosBase64)
    let errors = [];
    var mensajeComplemento=" esta vacío."

    // //////////////////console.log(JSON.stringify(this.documentosBase64))
    //////////////////console.log("Cantidad documentos: "+Object.keys(this.documentosBase64).length)

    var documentoLlenos=[];
    for (let i = 0; i < Object.keys(this.documentosBase64).length; i++) {
      
      // //////////////////console.log(JSON.stringify(this.documentosBase64))
      if (Object.keys(this.documentosBase64[i]).length === 0) {
        
        /* i==0?errors.push(this.nobFileFormDatos+mensajeComplemento):
        i==1?errors.push(this.nobFileContFinan+mensajeComplemento): */
        // i==2?errors.push(this.nobFileFormConfor+mensajeComplemento):
        // i==3?errors.push("DNI"+mensajeComplemento):
        // i==4?errors.push("SOAT vigente"+mensajeComplemento):""
        // delete this.documentosBase64[i]; // Removes json.foo from the dictionary.s
        // JSON.parse(JSON.stringify(this.documentosBase64).sp)
        switch (i) {
          case 0:
            if (this.productoSeleccionado.idTipoProducto==1 || this.productoSeleccionado.idTipoProducto==1 ) {
              errors.push(this.nombFileTPFrontal+mensajeComplemento)
            }
            break;
          case 1:
            if (this.productoSeleccionado.idTipoProducto==1 || this.productoSeleccionado.idTipoProducto==1 ) {
              errors.push(this.nombFileTPPosterior+mensajeComplemento)
            }
            break;
          case 2:
            if (this.flagDuenioVehiculo==0) {
              errors.push(this.nombFileCInformado+mensajeComplemento)
            }
            break;
          case 3:
            if (this.flagDuenioVehiculo==0) {
              errors.push(this.nombFileDVCInformado+mensajeComplemento)
            }
            break;
        
          default:
            break;
        }

      }else{
        documentoLlenos.push(this.documentosBase64[i])
      }
      
    }

    
    //////////////////console.log(JSON.stringify(this.documentosBase64))

    if (Object.keys(errors).length === 0) {
      //Sigue proceso de guardado
      this.documentosBase64=documentoLlenos;
      this.guardarDatos();
    } else{this.commonService.getErrorHtmlList(errors);}
    
  }

  ValidarCampos(formulario:string,dato:number){
    
    switch (formulario) {
      case "TipoVivienda":
        
        if (dato==1) {
          this.thirdFormGroup.get('mesesContrato').enable();
          this.thirdFormGroup.controls["mesesContrato"].setValidators([Validators.required]);
          this.thirdFormGroup.controls['mesesContrato'].updateValueAndValidity()

          
        }else{
          this.thirdFormGroup.get('mesesContrato').setValue('');
          this.thirdFormGroup.get('mesesContrato').disable();
          this.thirdFormGroup.get('mesesContrato').setValidators([]); // or clearValidators()
          this.thirdFormGroup.get('mesesContrato').updateValueAndValidity();
          
        }

        break;
      case "montFinanciar":

      if (this.fifthFormGroup.get('montFinanciar').value=="") {
        this.fifthFormGroup.patchValue({
          montFinanciar:'0'
        })
      }
        
      var montoFinanciar=parseInt(this.fifthFormGroup.get('montFinanciar').value);
      var precioTotal=this.productoSeleccionado.precio;
      this.cantidadDigitos=precioTotal.toString().length
      //////////////////////console.log(montoFinanciar)
      //////////////////////console.log(precioTotal)
      // //////////////////////console.log(montoFinanciar,precioTotal)
        if (montoFinanciar<=precioTotal) {
          
        }else{
          // alert("MONTO FINANCIAR NO DEBE SER MAYOR AL PRECIO")
          
          let errors = [];
          errors.push("Monto financiar no debe ser mayor al precio del producto/servicio");
          this.commonService.getErrorHtmlList(errors);
    

          // alert(montoFinanciar.toString().substring(0, montoFinanciar.toString().length - 1))
          montoFinanciar=parseInt(montoFinanciar.toString().substring(0, montoFinanciar.toString().length - 1));
          this.fifthFormGroup.patchValue({
            montFinanciar:montoFinanciar
          })
        }

        break;
    
      default:
        break;
    }

    

  }

  prueba(): void {
    // //////////////////////console.log(this.fifthFormGroup.get('montFinanciar').value)
    // this.myStepper.selectedIndex === 2
    // this.columnaStepper=4;

    this.stepper.linear = false;
    this.stepper.selectedIndex = 4;
    setTimeout(() => {
       this.stepper.linear = true;
    });

  }

  ValidarFormularioInformacionVehiculo(flag:number){
    switch (flag) {
      case 1:
        
        break;
      case 2:
        


        break;
      default:
        break;
    }
  }

  backValidarTipoProducto(formulario:number){

    switch (formulario) {
      case 5:
        // this.fourthFormGroup = this.formBuilder.group({
        //   placa :['', Validators.required],
        //   marcAuto :['', Validators.required],
        //   modeloAuto :['', Validators.required],
        //   anioFabricacion :['', Validators.required],
        //   // tarjetaProp :['', Validators.required],
        //   // cilindraMotor :['', Validators.required],
        //   radUsoVehiculo :['', Validators.required],
        //   radEstadoVehiculo :['', Validators.required],
        //   ingMensuales :['', Validators.required],
        //   numHijos :['', Validators.required],
        // });
        
        this.stepper.linear = false;
        this.stepper.selectedIndex = 2;
        setTimeout(() => {
           this.stepper.linear = true;
        });
    
        this.disabledProductoCombo=false

        break;
      case 4:
        
        this.disabledProductoCombo=false
        
        break;
      default:
        break;
    }
  }

  descargarDocumento(clave) {

    var key={
      "keyUser":clave
    }

    this.maestroService.getMaestroByClave(key).subscribe(response => {
      ////////////////////////console.log("ACTUALIZAR")
      ////////////////////////console.log(response)
      var url=response.valor.split("Financiamientos_GNV")
      var urlDownload=this.urlVirtualDirectory+url[1];

      var win = window.open(urlDownload, '_blank');
      // Cambiar el foco al nuevo tab (punto opcional)
      // win.focus();

    })

    
    
  }

  mostrarDigitoVerificador(event:MatCheckboxChange){
    ////////////console.log(event.checked)
    if (event.checked) {
      this.flagDigitoVerificador=true;
      this.eighthFormGroup

      this.eighthFormGroup.controls["digitoVerificador"].setValidators([Validators.required]);
      this.eighthFormGroup.controls['digitoVerificador'].updateValueAndValidity()
    }else{
      this.flagDigitoVerificador=false;
      this.eighthFormGroup.get('digitoVerificador').setValidators([]); // or clearValidators()
      this.eighthFormGroup.get('digitoVerificador').updateValueAndValidity();
    }
  }

  ayudaDigitoVerificador(){
    // //////////////////////////console.log(idPreevaluacion);
    // this.authorizesService.redirectGestionInformacion(idUsuario);
      var url=document.location.origin+"/assets/images/icons/dni-digito-verificador.png"
      var win = window.open(url, '_blank');
      // var win = window.open(url);
      // Cambiar el foco al nuevo tab (punto opcional)
      win.focus();
    
    
  }

  chosenYearHandler(normalizedYear, datepicker: MatDatepicker<any>) {
    const fechaAñio=new Date(normalizedYear)
    
    /* console.log(fechaAñio.getFullYear());
    console.log(new Date(normalizedYear).toISOString());
    //console.log(normalizedYear.year());
    const ctrlValue = this.fourthFormGroup.value.anioFabricacion
    ctrlValue.year(fechaAñio.getFullYear()); */
    //this.fourthFormGroup.value.anioFabricacion.setValue(fechaAñio.getFullYear());
    this.fourthFormGroup.patchValue({
      anioFabricacion:fechaAñio.getFullYear()
    })
    console.log(this.fourthFormGroup.value.anioFabricacion)
    datepicker.close();
  }

  validarPoliticas(tipo:string){
    let errors = [];
    console.log(this.seventhFormGroup.value.tconformidad)
    console.log(this.seventhFormGroup.value.tpoliticasCondiciones)
    switch (tipo) {
      case "1":
        if (this.seventhFormGroup.value.tconformidad==false) {
          errors.push('Debe aceptar el contenido del contrato y dar conformidad .');
          this.seventhFormGroup.patchValue({
            tconformidad:undefined
          })
        }
        if (this.seventhFormGroup.value.tpoliticasCondiciones==false) {
          this.seventhFormGroup.patchValue({
            tpoliticasCondiciones:undefined
          })
        }
        break;
      case "2":
        if (this.seventhFormGroup.value.tconformidad==false) {
          this.seventhFormGroup.patchValue({
            tconformidad:undefined
          })
        }
        if (this.seventhFormGroup.value.tpoliticasCondiciones==false) {
          errors.push('Debe aceptar los términos y condiciones .');
          this.seventhFormGroup.patchValue({
            tpoliticasCondiciones:undefined
          })
        }
        break;
      default:
        break;
    }

    if (errors.length==0) {
      return true
    }else{
      //this.commonService.getErrorHtmlList(errors);
      return false;
    }
  }

  abrirPendientesFinanciamiento(idTipoDocumento:number,numDocumento:string){
    //const dialogRef =  this.dialog.open(PendienteFormularioComponent, {data: {name: this.name}, disableClose: true});
    const dialogRef =  this.dialog.open(PendienteFormularioComponent, {data: {idTipoDocumento: idTipoDocumento,numDocumento:numDocumento},disableClose: true});
    dialogRef.afterClosed().subscribe((submit) => {
     if (submit) {
       //this.food = submit;
       console.log("DATA MOSTRAR: "+JSON.stringify(submit))
       this.poblarDataTemporal(submit[0])
       this.flagTemporal=true
     } else {
       console.log("Nothing")
       //this.food = 'Nothing...';
     }
   })
  }

  botonFirmado(valor:string){
    this.flagBotonFirmado=valor=="0"?false:true;
  }
 
  poblarDataTemporal(data:SolicitudFinanciamientoModel){

    this.idSfCliente=data.idSfCliente;
    this.flagPreevaluacion=true;

    var flagPreevaluacionFinanciado=false;

    this.solFinanciamientoTempModel=data;

    for (let i = 0; i < Object.keys(this.listProductoPorCliente).length; i++) {
      if (this.listProductoPorCliente[i].idPreevaluacion==data.idPreevaluacion) {
        flagPreevaluacionFinanciado=true;
        this.obtenerDatosProducto(this.listProductoPorCliente[i])
        
        break; 
      }
    }

    if (!flagPreevaluacionFinanciado) {
      let respuesta = [];
      if (data.idPreevaluacion!=0) {
        respuesta.push('Preevaluacion '+data.idPreevaluacion+" ya se encuentra financiado.");
      this.commonService.getErrorHtmlList(respuesta);
      }
      

    }

    //1er Formulario
    this.firstFormGroup.patchValue({
      nombres : data.nombres,
      apellidos :data.apellidos,
      dni : data.numeroDocumento,
      // fechaEmision :['', Validators.required],
      fechaNacimiento : this.datePipe.transform(data.fechaNacimiento,'yyyy-MM-dd'),
      correo :data.correoElectronico,
      celular :data.celular,
    })
    
    for (let i = 0; i < Object.keys(this.listEstadoCivil).length; i++) {
   
      if (this.listEstadoCivil[i].id==data.estadoCivil.toString()) {
        console.log(this.listEstadoCivil[i])
        this.firstFormGroup.patchValue({
          estadoCivil :this.listEstadoCivil[i]
        })
        this.opcionSeleccionado('3',this.listEstadoCivil[i])
        break; 
      }
    }

    for (let i = 0; i < Object.keys(this.listNivelEstudios).length; i++) {
      if (this.listNivelEstudios[i].id==data.idNivelEstudios.toString()) {
        console.log(this.listNivelEstudios[i])
        this.firstFormGroup.patchValue({
          nivelEstudios :this.listNivelEstudios[i]
        })
        this.opcionSeleccionado('1',this.listNivelEstudios[i])
        break; 
      }
    }

    //2do Formulario
    this.secondFormGroup.patchValue({
      radOcupacion : data.ocupacion,
      radContrato :data.tipoContrato,
      radTiempo : data.mesAnio,
      tiempoEmpleo :data.tiempoEmpleoCliente,
    })

    //3er Formulario
    this.thirdFormGroup.patchValue({
      radTipoCalle : data.tipoCalle,
      otraCalle :"",
      direccion : data.direccion,
      numInterior :data.numeroInterior,
      mzLt :data.mzLt,
      distrito :data.distrito,
      referencias :data.referenciaDomicilio,
      radTipoVivienda :data.tipoVivienda,
      aniosVivienda :data.tiempoAnoVivienda,
      mesesContrato :data.tiempoMesesVivienda,
      radTieneGas :data.isGasNatural?'true':'false',
    })

    //4to Formulario
    this.fourthFormGroup.patchValue({
      placa : data.numeroPlaca,
      marcAuto :data.marcaAuto,
      modeloAuto : data.modeloAuto,
      anioFabricacion :data.fechaFabricacion.toString().slice(0,4),
      radUsoVehiculo :data.tipoUsoVehicular?'true':'false',
      //radEstadoVehiculo :data.estadoVehiculo?'true':'false',
      ingMensuales :data.ingresoMensual,
      numHijos:data.numeroHijos==0?'0':data.numeroHijos
    })


    for (let i = 0; i < Object.keys(this.listEstadoVehicular).length; i++) {
      if (this.listEstadoVehicular[i].id==data.estadoVehiculo) {
        console.log(this.listEstadoVehicular[i])
        this.fourthFormGroup.patchValue({
          radEstadoVehiculo :this.listEstadoVehicular[i]
        })
        break; 
      }
    }

    //5to Formulario
    this.fifthFormGroup.patchValue({
      //nombProducto : data.numeroPlaca,
      //nombProveedor :data.nombreEstablecimiento,
      //nombPrecio : data.modeloAuto,
      nombEstablecimiento :data.nombreEstablecimiento,
      radReqFinanciamiento :data.tipoFinanciamiento,
      //inputOtras :data.ingresoMensual,
      radTipoCredito:data.tipoCredito,
      radPlazoMaximo :data.plazoCuotasFinanciamiento,
      //montFinanciar :data.ingresoMensual,
      observacion :data.observaciones,
    })

    //6to Formulario
    this.fifthFormGroup.patchValue({
      radTaller : data.idTaller
    })

  }

  guardarBorrador(){

    this.solFinanciamientoModel.idSfCliente                  = this.idSfCliente;

    this.solFinanciamientoModel.idCliente                  = Number(this.datosCliente.id);

    this.solFinanciamientoModel.nombres                    = this.firstFormGroup.get('nombres').value;
    this.solFinanciamientoModel.apellidos                  = this.firstFormGroup.get('apellidos').value;
    this.solFinanciamientoModel.numeroDocumento            = String(this.firstFormGroup.get('dni').value);
    this.solFinanciamientoModel.codUbigeo                  = '';
    //this.solFinanciamientoModel.fechaEmision               = this.firstFormGroup.get('fechaEmision').value;
    this.solFinanciamientoModel.fechaNacimiento            = this.firstFormGroup.get('fechaNacimiento').value;
    this.solFinanciamientoModel.estadoCivil                = this.comboEstadoCivil.id;
    this.solFinanciamientoModel.correoElectronico          = this.firstFormGroup.get('correo').value;
    this.solFinanciamientoModel.celular                    = String(this.firstFormGroup.get('celular').value);
    this.solFinanciamientoModel.idNivelEstudios            = this.comboNivelEstudio.id;

    this.solFinanciamientoModel.ocupacion                  = this.secondFormGroup.get('radOcupacion').value;
    this.solFinanciamientoModel.tipoContrato               = this.secondFormGroup.get('radContrato').value;
    this.solFinanciamientoModel.tiempoEmpleoCliente        = this.secondFormGroup.get('tiempoEmpleo').value;

    this.solFinanciamientoModel.tipoCalle                  = this.thirdFormGroup.get('radTipoCalle').value;
    this.solFinanciamientoModel.direccion                  = this.thirdFormGroup.get('direccion').value;
    this.solFinanciamientoModel.numeroInterior             = Number(this.thirdFormGroup.get('numInterior').value);
    this.solFinanciamientoModel.mzLt                       = this.thirdFormGroup.get('mzLt').value;
    this.solFinanciamientoModel.distrito                   = this.thirdFormGroup.get('distrito').value;
    this.solFinanciamientoModel.referenciaDomicilio        = this.thirdFormGroup.get('referencias').value;
    this.solFinanciamientoModel.tipoVivienda               = this.thirdFormGroup.get('radTipoVivienda').value;
    this.solFinanciamientoModel.tiempoAnoVivienda          = parseInt(this.thirdFormGroup.get('aniosVivienda').value);
    this.solFinanciamientoModel.tiempoMesesVivienda        = parseInt(this.thirdFormGroup.get('mesesContrato').value);
    this.solFinanciamientoModel.isGasNatural               = Boolean(this.thirdFormGroup.get('radTieneGas').value);

    this.solFinanciamientoModel.numeroPlaca                = this.fourthFormGroup.get('placa').value;
    this.solFinanciamientoModel.marcaAuto                  = this.fourthFormGroup.get('marcAuto').value;
    this.solFinanciamientoModel.modeloAuto                 = this.fourthFormGroup.get('modeloAuto').value;
    this.solFinanciamientoModel.fechaFabricacion           = new Date(this.fourthFormGroup.get('anioFabricacion').value + "-01-01");
   //  this.solFinanciamientoModel.numeroTarjetaPropiedad     = String(this.fourthFormGroup.get('tarjetaProp').value);
   //  this.solFinanciamientoModel.tipoCilindroMotor          = this.fourthFormGroup.get('cilindraMotor').value;
    this.solFinanciamientoModel.numeroTarjetaPropiedad     = "";
    this.solFinanciamientoModel.tipoCilindroMotor          = "";
    this.solFinanciamientoModel.tipoUsoVehicular           = Boolean(this.fourthFormGroup.get('radUsoVehiculo').value);
   //  this.solFinanciamientoModel.estadoVehiculo             = Number(this.fourthFormGroup.get('radEstadoVehiculo').value);

   this.solFinanciamientoModel.estadoVehiculo             = this.radioEstadoVehiculo.id
    this.solFinanciamientoModel.ingresoMensual             = String(this.fourthFormGroup.get('ingMensuales').value);
    this.solFinanciamientoModel.numeroHijos                = parseInt(this.fourthFormGroup.get('numHijos').value);

    this.solFinanciamientoModel.nombreEstablecimiento      = this.fifthFormGroup.get('nombEstablecimiento').value;
    this.solFinanciamientoModel.tipoFinanciamiento         = this.fifthFormGroup.get('radReqFinanciamiento').value;
    this.solFinanciamientoModel.tipoCredito                = Number(this.fifthFormGroup.get('radTipoCredito').value);
    this.solFinanciamientoModel.plazoCuotasFinanciamiento  = this.fifthFormGroup.get('radPlazoMaximo').value;
    //this.solFinanciamientoModel.montoFinanciamiento        = parseInt(this.fifthFormGroup.get('montFinanciar').value);
    this.solFinanciamientoModel.montoFinanciamiento        = this.productoSeleccionado.precio;
    this.solFinanciamientoModel.observaciones              = this.fifthFormGroup.get('observacion').value;

    this.solFinanciamientoModel.idTaller                   = Number(this.sixthFormGroup.get('radTaller').value);

    this.solFinanciamientoModel.numeroScore                =0;
    this.solFinanciamientoModel.idPreevaluacion            =this.idPreevaluacion;
    //this.solFinanciamientoModel.flagContratoFinanciamiento  =this.seventhFormGroup.get('checkContrFinanciamiento').value;
    //this.solFinanciamientoModel.flagFormatoConformidad      =false;
    this.solFinanciamientoModel.flagDNI                     =false;
    this.solFinanciamientoModel.digitoVerificadorDNI        =this.seventhFormGroup.get('digitoVerificador').value;
    //Nuevos campos word 4
    this.solFinanciamientoModel.flagFormatoConformidad                =this.seventhFormGroup.get('tconformidad').value;
    this.solFinanciamientoModel.FlagpoliticasCondiciones       =this.seventhFormGroup.get('tpoliticasCondiciones').value;
    this.solFinanciamientoModel.flagDNI                    =this.seventhFormGroup.get('checkDNI').value;
    this.solFinanciamientoModel.flagContratoFinanciamiento    =this.seventhFormGroup.get('checkContrFinanciamiento').value;
    this.solFinanciamientoModel.MesAnio    =this.secondFormGroup.get('radTiempo').value;


    this.fechaNacimiento=this.getEdad(this.solFinanciamientoModel.fechaNacimiento)
   this.fechaCreacion=this.getEdad(this.solFinanciamientoModel.fechaFabricacion)

   //  //////////////////////////console.log("DATOS GUARDAR SOLICITUD FINANCIAMIENTO: "+JSON.stringify(this.solFinanciamientoModel));
   this.registrarDatosTemporales(this.solFinanciamientoModel);

  }

  cargarTablaFinanciamiento(){
    // //////////////////////////console.log(this.page);

    this.financiamientoService.getListFinanciamiento(this.datosUsuario.idTipoDocumento,this.datosUsuario.numeroDocumento,this.page,this.size).subscribe( 
      response =>{
        console.log(JSON.stringify(response))
        this.datosFinanciamiento = response.data;
        this.previousPage = response.meta.hasPreviousPage;
        this.nextPage = response.meta.hasNextPage;
        this.totalPages = new Array(response.meta['totalPages']);
        this.totalDatos = response.meta.totalCount;

        //  //////////////////////////console.log("DATA: "+JSON.stringify(response.data))
      }
    )
    
  }

  cambiarVista(valor:string){
    this.flagPreevaluacion=valor=="0"?false:true;
  }

  pintarDatosFinanciamiento(data){
    //this.poblarDataTemporal(dataFinanciamiento)
    console.log(JSON.stringify(data))
    for (let i = 0; i < Object.keys(this.listEstadoCivil).length; i++) {
      if (this.listEstadoCivil[i].id==data.estadoCivil.toString()) {
        console.log(this.listEstadoCivil[i])
        /* this.firstFormGroup.patchValue({
          estadoCivil :this.listEstadoCivil[i]
        }) */
        this.opcionSeleccionado('3',this.listEstadoCivil[i])
        this.txtEstadoCivil=this.listEstadoCivil[i].estado;
        break; 
      }
    }

    for (let i = 0; i < Object.keys(this.listNivelEstudios).length; i++) {
      if (this.listNivelEstudios[i].id==data.idNivelEstudios.toString()) {
        console.log(this.listNivelEstudios[i])
        /* this.firstFormGroup.patchValue({
          nivelEstudios :this.listNivelEstudios[i]
        }) */
        this.opcionSeleccionado('1',this.listNivelEstudios[i])
        this.txtNivelEstudios=this.listNivelEstudios[i].estado;
        break; 
      }
    }

    for (let i = 0; i < Object.keys(this.listEstadoVehicular).length; i++) {
      if (this.listEstadoVehicular[i].id==data.estadoVehiculo) {
        console.log(this.listEstadoVehicular[i])
        /* this.fourthFormGroup.patchValue({
          radEstadoVehiculo :this.listEstadoVehicular[i]
        }) */
        this.txtEstadoVehicular=this.listEstadoVehicular[i].estado;
        break; 
      }
    }

    for (let i = 0; i < Object.keys(this.listTipoFinanciamiento).length; i++) {
      if (this.listTipoFinanciamiento[i].id==data.tipoFinanciamiento) {
        console.log(this.listTipoFinanciamiento[i])
        /* this.fourthFormGroup.patchValue({
          radEstadoVehiculo :this.listTipoFinanciamiento[i]
        }) */
        this.txtTipoFinanciamiento=this.listTipoFinanciamiento[i].descripcion;
        break; 
      }
    }

    for (let i = 0; i < Object.keys(this.listTipoCreditoFinanciamiento).length; i++) {
      if (this.listTipoCreditoFinanciamiento[i].id==data.tipoCredito) {
        console.log(this.listTipoCreditoFinanciamiento[i])
        /* this.fourthFormGroup.patchValue({
          radEstadoVehiculo :this.listTipoFinanciamiento[i]
        }) */
        this.txtTipoCredito=this.listTipoCreditoFinanciamiento[i].tipoCredito;
        break; 
      }
    }

    data.estadoCivil=this.txtEstadoCivil;
    data.idNivelEstudios=this.txtNivelEstudios;
    data.estadoVehiculo=this.txtEstadoVehicular;
    data.tipoFinanciamiento=this.txtTipoFinanciamiento;
    data.tipoCredito=this.txtTipoCredito;
    data.idTaller=data.taller

    data.tiempoAnoVivienda=data.tiempoAnoVivienda+" años"
    data.tiempoMesesVivienda=data.tiempoMesesVivienda+" meses"
    data.isGasNatural=data.isGasNatural?'Si':'No';
    data.tipoUsoVehicular=data.tipoUsoVehicular?'Uso particular':'Uso público'
    data.fechaNacimiento=formatDate(data.fechaNacimiento, 'dd/MM/yyyy', 'en-US');
    data.fechaFabricacion=formatDate(data.fechaFabricacion, 'yyyy', 'en-US');
    console.log(this.txtEstadoVehicular)
    this.abrirDataFinanciamiento(data)

  }

  abrirDataFinanciamiento(data){
    //const dialogRef =  this.dialog.open(PendienteFormularioComponent, {data: {name: this.name}, disableClose: true});
    const dialogRef =  this.dialog.open(DetalleFinanciamientoComponent, {data: data,disableClose: true});
    dialogRef.afterClosed().subscribe((submit) => {
     if (submit) {
       //this.food = submit;
       console.log("DATA MOSTRAR: "+JSON.stringify(submit))
       /* this.poblarDataTemporal(submit[0])
       this.flagTemporal=true */
     } else {
       console.log("Nothing")
       //this.food = 'Nothing...';
     }
   })
  }

}
