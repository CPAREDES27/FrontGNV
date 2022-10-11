import { DatePipe } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; 
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { disable } from '@rxweb/reactive-form-validators';
import { UserTypeGnv } from 'src/app/enums/user-type.enum';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import { CargaDocumentoModel } from 'src/app/models/carga-documentos/cargaDocumento.model';
import { EstadoModel } from 'src/app/models/estados/estado.model';
import { EvaluacionClienteModel } from 'src/app/models/evaluacion-cliente/evaluacion-cliente.model';
import { KnockoutModel } from 'src/app/models/knockout/knockout.model';
import { ListKnockoutModel } from 'src/app/models/knockout/list-knockout.model';
import { MaestroModel } from 'src/app/models/maestro/maestro.model';
import { ListPreevaluacionModel } from 'src/app/models/preevaluacion/list-preevaluacion/list-preevaluacion.model';
import { UsuarioRegistrarRequestModel } from 'src/app/models/usuario-registrar/usuario-registrar-request.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { CargaDocumentosService } from 'src/app/services/cargaDocumentos.service';
import { ClienteRegisterService } from 'src/app/services/cliente-register.service';
import { CommonService } from 'src/app/services/common.service';
import { CorreoPlantillaService } from 'src/app/services/correo-plantilla.service';
import { EstadosService } from 'src/app/services/estados.service';
import { EvaluacionClienteService } from 'src/app/services/evaluacion-cliente.service';
import { MaestroService } from 'src/app/services/maestro.service';
import { ReglasKnockoutService } from 'src/app/services/reglas-knockout.service';
import { ModalAdjuntarComponent } from './modal-adjuntar/modal-adjuntar.component';
import { ModalAgregarAsesorComponent } from './modal-agregar-asesor/modal-agregar-asesor.component';
import { environment } from 'src/environments/environment';
import { DocumentoEvaluacionClienteModel } from 'src/app/models/evaluacion-cliente/documento-evaluacion-cliente.model';
import { ModalPdfComponent } from '../modal-pdf/modal-pdf.component';
import { GlobalVariable}from 'src/app/components/global'
import { WINDOW } from 'src/app/services/windows.service';
import { ModalPrevPdfComponent } from '../modal-prev-pdf/modal-prev-pdf.component';
import { RespuestaKnockoutModel } from 'src/app/models/knockout/rpt-knockout.model';


@Component({
  selector: 'app-reglas-knockout',
  templateUrl: './reglas-knockout.component.html',
  styleUrls: ['./reglas-knockout.component.scss']
})
export class ReglasKnockoutComponent implements OnInit {
  formDatosUsuario : FormGroup;  
  formReglasKnockout : FormGroup; 

  preevaluacionClient: ListPreevaluacionModel[] = [];
  listaDatosFormNockout: ListKnockoutModel;
  knockoutModel= new KnockoutModel();
  // @Input('formReglasKnockout') disableForm: boolean;

  fecha = new Date().toISOString();
  
  //Adjuntos
  nombFileSustento = 'Adjuntar sustento';
  nombFileClienteTitular = 'Adjuntar sustento';
  nombFileDniRegistradoReniec = 'Adjuntar sustento';
  nombFileDniTitularContrato = 'Adjuntar sustento';
  nombFileLicenciaConducirVigente = 'Adjuntar sustento';
  nombFileTitularContratoPropietario = 'Adjuntar sustento';
  nombFileSoatVigente = 'Adjuntar sustento';
  nombFileVehiculoMultas = 'Adjuntar sustento';
  nombFileTitularContrato = 'Adjuntar sustento';
  nombFileVehiculoCaptura = 'Adjuntar sustento';
  nombFileVehiculoGNV = 'Adjuntar sustento';
  
  //Documentos adjuntar Asesor de Ventas
  formAdjuntarDocAsesorVentas : FormGroup;  

      //Titulo documentos
  nobContratoFinanciamiento = 'Contrato de Financiamiento Firmado';
  nobDniFrontal = 'DNI cara frontal ';
  nobDniPosterior = 'DNI cara posterior';
  nobTarjetaFrontal = 'Tarjeta de Propiedad cara frontal';
  nobTarjetaPosterior = 'Tarjeta de Propiedad cara posterior ';
  nobConsentimientoInformado = 'Foto del Consentimiento Informado ';
  nobDueioVehiculo = 'Foto del dueño del vehículo con el Consentimiento Informado';

      //Nombre Documentos
  nomAdjContratoFinanciamiento = 'Adjuntar documento';
  nomAdjDniFrontal = 'Adjuntar documento';
  nomAdjDniPosterior = 'Adjuntar documento';
  nomAdjTarjetaFrontal = 'Adjuntar documento';
  nomAdjTarjetaPosterior = 'Adjuntar documento';
  nomAdjConsentimientoInformado = 'Adjuntar documento';
  nomAdjDueioVehiculo = 'Adjuntar documento';





  messageSuccess = [];
  
  // tipoEstados = [
  //   { value: '4', description: 'Aprobado' },
  //   { value: '5', description: 'Rechazado' }
  // ];

  tipoEstados:EstadoModel;



  idPreevaluacion = 0;
  idTipoProducto=0;

  //Modelo para crear el usuario
  usuarioModel = new UsuarioRegistrarRequestModel();
  
  //Datos de la preevaluacion
  dataPreevaluacion:ListKnockoutModel;
  dataREglaKnockout:RespuestaKnockoutModel;

  // Modelo para la carga de archivos
  cargaDocumentoRKModel=new CargaDocumentoModel();

  evaluacionClienteModel:EvaluacionClienteModel;

  //Contraseña
  characters: String;
  password:String;
  deshabilitarBotonAgregar:Boolean=true;

  messageSucces = [];
  datosUsuario:AuthorizeModel;
  rolId:number=0;

  //Transformar a base64
  archivoBase64:string="";
  documentosBase64=[{},{},{},{},{},{},{},{},{},{},{}];
  documentosAdjuntarBase64=[{},{},{},{},{},{},{}];

  ocultarReglasKnockout:Boolean=true;
  ocultarBotonRegistarUsuario:Boolean=true;
  ocultarAdjuntarConformidad:Boolean=true;
  ocultarVencimientoSoat:Boolean=false;

  deshabilitarDatos:Boolean=false;

  maestro:MaestroModel;

  rechazarRK:boolean=false;

  montoMinimoMaximo:string[]=[]

  urlVirtualDirectory: string = environment.urlVirtualDirectory;

  listaDocumentosAdjuntadosAV:DocumentoEvaluacionClienteModel;
  documentosAdjuntosLleno:boolean=false;
  ocultaBotondocumentosAdjuntosLleno:boolean=false;

  constructor(
    private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private reglasKnockoutService: ReglasKnockoutService,
    private estadoService:EstadosService,
    private commonService: CommonService,
    private clienteRegisterService: ClienteRegisterService,
    private correoPlantilla:CorreoPlantillaService,
    private cargaDocumentoService:CargaDocumentosService,
    private evaluacionClienteService:EvaluacionClienteService,
    private authorizesService:AuthorizesService,
    private datePipe: DatePipe,
    private maestroService:MaestroService,
    private dialog: MatDialog,
    @Inject(WINDOW) public window: Window
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(data=>{
      this.idPreevaluacion = data['id'];
     //this.obtenerDatos(this.idPreevaluacion);
    });



    this.formularioDatos();
    this.formularioReglas();
    this.formularioDocAsesorVentas();
    
    this.cargarDataForm(this.idPreevaluacion);
    // this.crearFormReglasInsert();
    
    this.listarEstados();
    this.obtnerDatosUSerLogeado();
    this.consultarMontoMinMax();
    // this.validarExistePreevaluacionEnRK(this.idPreevaluacion);
    
    

  }

  // obtenerDatos(id:number){
  //   this.reglasKnockoutService.getPendingPrevaluationClient(id).subscribe(response => {
  //     this.listaDatosFormNockout = response;
  //   });
  // }

  obtnerDatosUSerLogeado(){
    this.datosUsuario=this.authorizesService.getUserAuth();
    // ////////////////////console.log(this.datosUsuario)
    this.rolId=parseInt(this.datosUsuario.rol);

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

  formularioReglas(){
    this.formReglasKnockout = new FormGroup({

      vrVehiculoGN: new FormControl(),
      fechaVencimientoRevisionAnual: new FormControl(),
      fechaVencimientoCilindro: new FormControl(),
      fechaVencimientoSoat:new FormControl(),
      vrCreditoActivo: new FormControl(),
      vrHabilitadoConsumo: new FormControl(),
      vrVehiculoAntiguedad: new FormControl(),
      vrClienteTitular: new FormControl(),
      vrDniRegistradoReniec: new FormControl(),
      vrDniTitularContrato: new FormControl(),
      vrLicenciaConducirVigente: new FormControl(),
      vrTitularContratoPropietario: new FormControl(),
      vrSoatVigente: new FormControl(),
      vrVehiculoMultas: new FormControl(),
      vrTitularContrato: new FormControl(),
      vrVehiculoCaptura: new FormControl(),
      estadoEvaluacion: new FormControl("SinEstado",[Validators.required]),
      
      //Files
      fileSustento: new FormControl(),
      fileClienteTitular: new FormControl(),
      fileDniRegistradoReniec: new FormControl(),
      fileDniTitularContrato: new FormControl(),
      fileLicenciaConducirVigente: new FormControl(),
      fileTitularContratoPropietario: new FormControl(),
      fileSoatVigente: new FormControl(),
      fileVehiculoMultas: new FormControl(),
      fileTitularContrato: new FormControl(),
      fileVehiculoCaptura: new FormControl(),
      fileVehiculoGNV: new FormControl(),
    })
  }

  formularioDocAsesorVentas(){
    this.formAdjuntarDocAsesorVentas = new FormGroup({

      adjContratoFinanciamiento: new FormControl(),
      adjDniFrontal: new FormControl(),
      adjDniPosterior: new FormControl(),
      adjTarjetaFrontal: new FormControl(),
      adjTarjetaPosterior: new FormControl(),
      adjConsentimientoInformado: new FormControl(),
      adjDueñoVehiculo: new FormControl(),
    })
  }

  cargarDataForm(id:number){
    this.reglasKnockoutService.getPendingPrevaluationClient(id).subscribe(data => {
      this.dataPreevaluacion=data[0];
      this.idTipoProducto=this.dataPreevaluacion.idTipoProducto;
      this.consultarDocumentosAD(this.dataPreevaluacion.idPreevaluacion)
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

      // alert(this.formDatosUsuario.get('correoElectronicoCliente').value)
      this.ValidarCorreoExistente(this.formDatosUsuario.get('correoElectronicoCliente').value);
      this.generatePasswordRand(10,'');

      

    });
  }

  validarExistePreevaluacionEnRK(idPreevaluacion:number){
    this.reglasKnockoutService.getValidarReglaKnockoutExiste(idPreevaluacion).subscribe(data => {


      //////console.log("EXISTE O NO")
      //////console.log(JSON.stringify(data))

      if (data.valid) {

        this.dataREglaKnockout=data;
        //this.dataREglaKnockout.fileVehiculoGNV="ce";
        //asdsafas
        this.deshabilitarDatos=true;
        this.ocultarBotonRegistarUsuario=false;
        ////////////////console.log(data)
        // vrCreditoActivo:data.indicadorCreditoActivo==0?false:true,
        this.formReglasKnockout.patchValue(
          {
            fechaVencimientoRevisionAnual:this.datePipe.transform( data.fechaVencimientoRevisioAnual,'yyyy-MM-dd'),
            fechaVencimientoCilindro:this.datePipe.transform( data.fechaVencimientoCilindro,'yyyy-MM-dd'),
            vrCreditoActivo:data.indicadorCreditoActivo,
            vrHabilitadoConsumo:data.indicadorParaConsumir,
            vrVehiculoAntiguedad:data.indicadorAntiguedadMenos10Anios,
            vrClienteTitular:data.indicadorTitular20A65Anios,
            vrDniRegistradoReniec:data.indicadorDniRegistradoEnReniec,
            vrDniTitularContrato:data.indicadorDniTitularContrato,
            vrLicenciaConducirVigente:data.indicadorLicenciaConducirVigente,
            vrTitularContratoPropietario:data.indicadorTitularPropietarioVehiculo,
            vrSoatVigente:data.indicadorSoatVigente,
            vrVehiculoMultas:data.indicadorVehiculoNoMultasPendientePago,
            vrTitularContrato:data.indicadorTitularNoMultasPendientePago,
            vrVehiculoCaptura:data.indicadorVehiculoNoOrdenCaptura,
            estadoEvaluacion:data.idEstadoPrevaluacion,
            vrVehiculoGN:data.indicadorVehiculoFuncionaGNV,
            fechaVencimientoSoat:this.datePipe.transform(data.fechaVencimientoSOAT,'yyyy-MM-dd')
          }
        )

        this.mostrarVencimientoSoat(data.indicadorSoatVigente)
        this.ocultarAdjuntarConformidad=data.indicadorTitularPropietarioVehiculo

        this.formReglasKnockout.disable();
  
        if (data.idEstadoPrevaluacion==6) {
          this.formReglasKnockout.enable();
          this.deshabilitarDatos=false;
        }
        
      }else{

        this.deshabilitarDatos=false;
        this.ocultarBotonRegistarUsuario=true;
      }

      if (this.rolId!=2) {
        if (this.dataPreevaluacion.emailAsesor==undefined || this.dataPreevaluacion.emailAsesor=='' ) {
          
          //Mostrar Modal
          
          const dialogRef = this.dialog.open(ModalAgregarAsesorComponent, {
            // width:'50%',
            data: this.dataPreevaluacion.idPreevaluacion
          });
      
          dialogRef.afterClosed().subscribe(result => {
            ////////////console.log(result)
            if (result) {
              this.cargarDataForm(this.idPreevaluacion);
              this.consultarMontoMinMax();
            }else{
              this.formReglasKnockout.disable();
              this.deshabilitarDatos=true;
            }
            
            // this.crearFormReglasInsert();
          
            //this.consultarMontoMinMax();
          });
  
        }
       /*  else{
          this.formReglasKnockout.enable();
          this.deshabilitarDatos=false;
        } */
      }else{
        this.cargarDataForm(this.idPreevaluacion);
        // this.crearFormReglasInsert();
        //this.consultarMontoMinMax();
      }

      if (this.dataPreevaluacion.idEstadoPreevaluacion==5) {
        this.formReglasKnockout.disable();
        this.deshabilitarDatos=true;
      }
      


    });
  }

  //Validar Si la POreevaluacion existe enel registro solicitud financiamiento
  validarPreevaluacionSF(idPreevaluacion:number){

    this.reglasKnockoutService.getValidarPreevaluacionExisteSF(idPreevaluacion).subscribe(data => {
    
      if (data.valid) {
        this.validarExistePreevaluacionEnRK(this.idPreevaluacion);
      }else{
        

        
    var montoMinimo=parseInt(this.montoMinimoMaximo[0])
    var montoMaximo=parseInt(this.montoMinimoMaximo[1])
    //Menor a 2000
    if (this.dataPreevaluacion.precio<=montoMinimo) {
      //No mostrara mensaje


    }else if (this.dataPreevaluacion.precio>montoMinimo && this.dataPreevaluacion.precio<=montoMaximo) {
      //Mostrara mensaje
     
      this.deshabilitarDatos=true;
        // this.formReglasKnockout.disable();
        let errors = [];
        errors.push(data.message);
        this.commonService.getErrorHtmlList(errors);
      


    }else if (this.dataPreevaluacion.precio>montoMaximo) {
      //Monto mayor al monto maximo
      //Enviar una alerta
      //El importe del producto supera el maximo permitido 
      let errors = [];
      errors.push('El importe del producto supera el máximo permitido.');
      this.commonService.getErrorHtmlList(errors); 
      // alert("El importe del producto supera el maximo permitido ")
    }


    this.validarExistePreevaluacionEnRK(this.idPreevaluacion);

      }

    });


  }

  validarCampos(){
    if(this.formReglasKnockout.valid) return true;
    else{
      let errors = [];
      if (this.formReglasKnockout.get('fechaVencimientoRevisionAnual').hasError('required')) errors.push('Debe ingresar fecha de vencimiento revisón anual.');
      if (this.formReglasKnockout.get('fechaVencimientoCilindro').hasError('required')) errors.push('Debe ingresar fecha de vencimiento cilindro.');
      if (this.formReglasKnockout.get('vrCreditoActivo').hasError('required')) errors.push('Seleccione una opción para crédito activo.');
      if (this.formReglasKnockout.get('vrHabilitadoConsumo').hasError('required')) errors.push('Seleccione una opción para Habilitado para consumir.');
      if (this.formReglasKnockout.get('vrVehiculoAntiguedad').hasError('required')) errors.push('Seleccione una opción para Vehículo tiene una antiguedad menor a 10 años.');
      if (this.formReglasKnockout.get('vrClienteTitular').hasError('required')) errors.push('Seleccione una opción para titular tiene entre 20 a 65 años.');
      if (this.formReglasKnockout.get('vrDniRegistradoReniec').hasError('required')) errors.push('Seleccione una opción para DNI está registrado en Reniec.');
      if (this.formReglasKnockout.get('vrDniTitularContrato').hasError('required')) errors.push('Seleccione una opción para DNI corresponde al titular del contrato.');
      if (this.formReglasKnockout.get('vrLicenciaConducirVigente').hasError('required')) errors.push('Seleccione una opción para licencia de conducir está en estado VIGENTE.');
      if (this.formReglasKnockout.get('vrTitularContratoPropietario').hasError('required')) errors.push('Seleccione una opción para El titular del contrato es propietario del vehículo.');
      if (this.formReglasKnockout.get('vrSoatVigente').hasError('required')) errors.push('Seleccione una opción para SOAT está vigente.');
      if (this.formReglasKnockout.get('vrVehiculoMultas').hasError('required')) errors.push('Seleccione una opción para Vehículo No tiene multas de tránsito.');
      if (this.formReglasKnockout.get('vrTitularContrato').hasError('required')) errors.push('Seleccione una opción para El titular del contrato No tiene multas de tránsito.');
      if (this.formReglasKnockout.get('vrVehiculoCaptura').hasError('required')) errors.push('Seleccione una opción para Vehículo NO tiene Orden de captura.');
      if (this.formReglasKnockout.get('estadoEvaluacion').hasError('required')) errors.push('Seleccione un estado de la pre evaluación.');
      
      this.commonService.getErrorHtmlList(errors);
      return false;
    }
  }
  
  validarRK(){
      // if (this.formReglasKnockout.get('fechaVencimientoRevisionAnual').value==false) this.rechazarRK=true;
      // if (this.formReglasKnockout.get('fechaVencimientoCilindro').value==false) this.rechazarRK=true;
      // if (this.formReglasKnockout.get('vrCreditoActivo').value==false) this.rechazarRK=true;
      // if (this.formReglasKnockout.get('vrHabilitadoConsumo').value==false) this.rechazarRK=true;
      // if (this.formReglasKnockout.get('vrVehiculoAntiguedad').value==false) this.rechazarRK=true;
      // if (this.formReglasKnockout.get('vrClienteTitular').value==false) this.rechazarRK=true;
      // if (this.formReglasKnockout.get('vrDniRegistradoReniec').value==false) this.rechazarRK=true;
      // if (this.formReglasKnockout.get('vrDniTitularContrato').value==false) this.rechazarRK=true;
      // if (this.formReglasKnockout.get('vrLicenciaConducirVigente').value==false) this.rechazarRK=true;
      // if (this.formReglasKnockout.get('vrTitularContratoPropietario').value==false)this.rechazarRK=true;
      // if (this.formReglasKnockout.get('vrSoatVigente').value==false) this.rechazarRK=true;
      /* if (this.formReglasKnockout.get('vrVehiculoMultas').value==true) this.rechazarRK=true; */
      if (this.formReglasKnockout.get('vrTitularContrato').value==false) this.rechazarRK=true;
      if (this.formReglasKnockout.get('vrVehiculoCaptura').value==false) this.rechazarRK=true;
      // if (this.formReglasKnockout.get('estadoEvaluacion').value==false) this.rechazarRK=true;
      return this.rechazarRK;
  }


  registrarReglas(){
    if(this.rechazarRK==false?this.validarRK():false){

      if (this.rechazarRK) {
        let errors = [];
        //SMSCAMBIAR 
        errors.push('Se recomienda rechazar.');
        this.commonService.getErrorHtmlList(errors);
        // this.rechazarRK=false;
      }
        
     
      
    }else{

      let errors = [];
      if (this.formReglasKnockout.get('estadoEvaluacion').value=="SinEstado") {
        
        errors.push('Seleccione un estado de la pre evaluación.');
      }

      if (Object.keys(errors).length === 0) {
        //Sigue proceso de guardado

        
      this.knockoutModel.idPreevaluacion = this.idPreevaluacion;
      this.knockoutModel.fechaVencimientoRevisioAnual = this.formReglasKnockout.get('fechaVencimientoRevisionAnual').value;
      this.knockoutModel.fechaVencimientoCilindro = this.formReglasKnockout.get('fechaVencimientoCilindro').value;
      this.knockoutModel.indicadorCreditoActivo = this.formReglasKnockout.get('vrCreditoActivo').value;
      this.knockoutModel.indicadorParaConsumir = this.formReglasKnockout.get('vrHabilitadoConsumo').value;
      this.knockoutModel.indicadorAntiguedadMenos10Anios = this.formReglasKnockout.get('vrVehiculoAntiguedad').value;
      this.knockoutModel.indicadorTitular20A65Anios = this.formReglasKnockout.get('vrClienteTitular').value;
      this.knockoutModel.indicadorDniRegistradoEnReniec = this.formReglasKnockout.get('vrDniRegistradoReniec').value;
      this.knockoutModel.indicadorDniTitularContrato = this.formReglasKnockout.get('vrDniTitularContrato').value;
      this.knockoutModel.indicadorLicenciaConducirVigente = this.formReglasKnockout.get('vrLicenciaConducirVigente').value;
      this.knockoutModel.indicadorTitularPropietarioVehiculo = this.formReglasKnockout.get('vrTitularContratoPropietario').value;
      this.knockoutModel.indicadorSoatVigente = this.formReglasKnockout.get('vrSoatVigente').value;
      this.knockoutModel.indicadorVehiculoNoMultasPendientePago = this.formReglasKnockout.get('vrVehiculoMultas').value;
      this.knockoutModel.indicadorTitularNoMultasPendientePago = this.formReglasKnockout.get('vrTitularContrato').value;
      this.knockoutModel.indicadorVehiculoNoOrdenCaptura = this.formReglasKnockout.get('vrVehiculoCaptura').value;
      this.knockoutModel.indicadorEstadoPreevaluacion = this.formReglasKnockout.get('estadoEvaluacion').value == 4 ? true : false;
      this.knockoutModel.fechaRegistro = this.fecha; //`${this.fecha}`;
      this.knockoutModel.idEstadoPrevaluacion = this.formReglasKnockout.get('estadoEvaluacion').value;

      this.knockoutModel.FechaVencimientoSOAT = this.formReglasKnockout.get('fechaVencimientoSoat').value;
      this.knockoutModel.IndicadorVehiculoFuncionaGNV = this.formReglasKnockout.get('vrVehiculoGN').value;
      this.knockoutModel.IdUsuarioRegistro = this.datosUsuario.id

      ////////////////////console.log(JSON.stringify(this.knockoutModel))

      // ////////////////////console.log(JSON.stringify(this.cargaDocumentoRKModel))
      
      this.registrarData();


      } else{this.commonService.getErrorHtmlList(errors);}

    }


  }

  registrarData(){

    //////////////////////////console.log("DATA: "+JSON.stringify(this.knockoutModel));
    if (this.knockoutModel.idEstadoPrevaluacion==4 || this.knockoutModel.idEstadoPrevaluacion==6) {
      this.reglasKnockoutService.postRegisterReglasKnockout(this.knockoutModel).subscribe(response =>{
        // //////////////////////////console.log("registrarData: "+JSON.stringify(response))
        ////////////////////////console.log("registrarData")
        ////////////////////////console.log(response)
        if (response.valid) {
          this.messageSuccess.push(response.message)
          
          //Validar si el monto es > 2000
          //Si es mayor a 2000, enviar el siguiente mensaje:
          //Para informar que su solicitud de financiamiento ha sido aprobado, ingresar al sistema para completar la informacion.
          // CAMBIAR CESAR
          this.correoPlantilla.enviarCorreoRegistro(
            this.formDatosUsuario.get('nombreCliente').value+" "+this.formDatosUsuario.get('apellidoCliente').value,
            [this.formDatosUsuario.get('correoElectronicoCliente').value,this.datosUsuario.usuario,this.dataPreevaluacion.correoProveedor],
            "Para informar que su solicitud de financiamiento ha sido aprobado, verifique el estado ingresando al sistema.","Estado solicitud de financiamiento.","/gnv/preevaluacion")
              

          // this.actualizarPreevaluacion(this.knockoutModel.idPreevaluacion,4)
          //////////////////////////console.log("RESPUESTA: "+JSON.stringify(response))
           this.guardarDocumentos(response.idReglanockout,this.documentosBase64,this.messageSuccess)
          // this.commonService.getSuccessHtmlList(this.messageSuccess,'/gnv/preevaluacion'); 
        } else {
          let errors = [];
          errors.push('Se generó un error al registrar tus datos, intente nuevamente.');
          this.commonService.getErrorHtmlList(errors); 
        }
      });
    }else if(this.knockoutModel.idEstadoPrevaluacion==5){
      // alert("ENVIAR CORREO")
      this.correoPlantilla.enviarCorreoRegistro(
        this.formDatosUsuario.get('nombreCliente').value+" "+this.formDatosUsuario.get('apellidoCliente').value,
        [this.formDatosUsuario.get('correoElectronicoCliente').value,this.datosUsuario.usuario],
        "Su solicitud de financiamiento no ha sido aprobada, puede volver a intentar dentro de 1 mes.","Estado solicitud de financiamiento.","/gnv/preevaluacion")
        this.actualizarPreevaluacion(this.knockoutModel.idPreevaluacion,5)
    }
    /* else if (this.knockoutModel.idEstadoPrevaluacion==6) {
        let respuesta = [];
        respuesta.push(GlobalVariable.rkPendiente)
        this.commonService.getSuccessHtmlList(respuesta,'/gnv/preevaluacion'); 
    } */
    

  }

  actualizarPreevaluacion(idPreevaluacion:number,idEstado:number){
    this.reglasKnockoutService.postActualizarPreevaluacion(idPreevaluacion,idEstado).subscribe();
  }



  //Métodos Upload Files
  uploadFileSustento(event,nombrecampo:string) {
    // //////////////////////////console.log(event);
    this.transformarBase64(event.target,nombrecampo)
    // this.nobFileFormDatos = event.target.files[0].name;
    // //////////////////////////console.log(event.target.files[0].name);
  }

  //Métodos Upload Adjuntar Files
  uploadFileAdjuntarDocs(event,nombrecampo:string) {
    this.transformarDocsAdjuntarBase64(event.target,nombrecampo)
  }

  estadoFinalFinanciamiento(event){
    // //////////////////////////console.log(event.value)
    switch(event.value) {
      case '1':         
        this.formReglasKnockout.get('estadoEvaluacion').setValidators([Validators.required]);
      break;
      case '2':
        this.formReglasKnockout.get('estadoEvaluacion').setValidators([Validators.required]);
      break;  
    }
    this.formReglasKnockout.get('estadoEvaluacion').updateValueAndValidity();
  }
   
  //Registro de usuario automatico
  createUser() {
    try {
      this.usuarioModel.NomCliente = this.dataPreevaluacion.nombre;
			this.usuarioModel.ApeCliente = this.dataPreevaluacion.apellido;
			this.usuarioModel.UsuarioEmail = this.dataPreevaluacion.email;
			this.usuarioModel.TelefonoFijo = "";
			this.usuarioModel.TelefonoMovil = this.dataPreevaluacion.celular;
			this.usuarioModel.Contrasena = this.password.toString(); //Generar de contraseña random
      this.usuarioModel.RolId = UserTypeGnv.PersonaCliente; 
			this.usuarioModel.TermPoliticasPrivacidad = true;
			this.usuarioModel.TermFinesComerciales = true;
      this.usuarioModel.idTipoDocumento = this.dataPreevaluacion.idTipoDocumento;
      this.usuarioModel.numeroDocumento = this.dataPreevaluacion.numDocumento;
      this.usuarioModel.Ruc = "";
      this.usuarioModel.RazonSocial = "";

      this.RegisterClientPersona();
      
    } catch (error) {
      
    }
  } 

  generatePasswordRand(length,type) {

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
      this.password=pass;
    }
    
  
    // //////////////////////////console.log(this.password)
    // return pass;
    ////////////////////////console.log(this.password)
  }

  RegisterClientPersona(){
    this.clienteRegisterService.registrarClientePersona(this.usuarioModel).subscribe(response => {
      // //////////////////////////console.log(response)
      
      if (response.valid) {
        this.messageSucces.push(response.message)

        this.correoPlantilla.enviarCorreoCreacionUsuario(
          this.usuarioModel.NomCliente + " " +this.usuarioModel.ApeCliente,
          this.usuarioModel.UsuarioEmail,
          this.password.toString(),
          this.usuarioModel.UsuarioEmail
        )

        this.cargarDataForm(this.idPreevaluacion);

        this.commonService.getSuccessHtmlList(this.messageSucces,'SinRuta'); 

      } else {
        let errors = [];
        // errors.push('Se generó un error al registrar tus datos, intente nuevamente.');
        errors.push(response.message);
        this.commonService.getErrorHtmlList(errors); 
      }
    })
  }

  ValidarCorreoExistente(correo:string){

    this.clienteRegisterService.getValidarUsuario(correo).subscribe(response => {


      if (response.activo) {
        this.deshabilitarBotonAgregar=true;

      } else {
        this.deshabilitarBotonAgregar=false;

      }
    })

    
  }

  listarEstados(){
    this.estadoService.getListEstados("Preevaluacion").subscribe(response => {
      this.tipoEstados=response;
    })
  }
     
  
  transformarBase64(inputValue: any,nombrecampo:string): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();

    myReader.onloadend = (e) => {
      
      var separarTipoDato=myReader.result.toString().split("base64,")
      this.archivoBase64 = separarTipoDato[1];
      // //////////////////////////console.log(this.archivoBase64)

      
      var nombreProceso="RK";
      switch (nombrecampo) {
        case "fileSustento":
          this.nombFileSustento =inputValue.files[0].name;
          this.documentosBase64[0]={
            "fileName":this.nombFileSustento,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileClienteTitular":
          this.nombFileClienteTitular = inputValue.files[0].name;

          this.documentosBase64[1]={
            "fileName":this.nombFileClienteTitular,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileDniRegistradoReniec":
          this.nombFileDniRegistradoReniec = inputValue.files[0].name;
          this.documentosBase64[2]={
            "fileName":this.nombFileDniRegistradoReniec,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileDniTitularContrato":
          this.nombFileDniTitularContrato = inputValue.files[0].name;
          this.documentosBase64[3]={
            "fileName":this.nombFileDniTitularContrato,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileLicenciaConducirVigente":
          this.nombFileLicenciaConducirVigente = inputValue.files[0].name;
          this.documentosBase64[4]={
            "fileName":this.nombFileLicenciaConducirVigente,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileTitularContratoPropietario":
          this.nombFileTitularContratoPropietario = inputValue.files[0].name;
          this.documentosBase64[5]={
            "fileName":this.nombFileTitularContratoPropietario,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileSoatVigente":
          this.nombFileSoatVigente = inputValue.files[0].name;
          this.documentosBase64[6]={
            "fileName":this.nombFileSoatVigente,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileVehiculoMultas":
          this.nombFileVehiculoMultas = inputValue.files[0].name;
          this.documentosBase64[7]={
            "fileName":this.nombFileVehiculoMultas,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileTitularContrato":
          this.nombFileTitularContrato = inputValue.files[0].name;
          this.documentosBase64[8]={
            "fileName":this.nombFileTitularContrato,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileVehiculoCaptura":
          this.nombFileVehiculoCaptura = inputValue.files[0].name;
          this.documentosBase64[9]={
            "fileName":this.nombFileVehiculoCaptura,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "fileVehiculoGNV":
          this.nombFileVehiculoGNV = inputValue.files[0].name;
          this.documentosBase64[10]={
            "fileName":this.nombFileVehiculoGNV,
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

  transformarDocsAdjuntarBase64(inputValue: any,nombrecampo:string): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();

    myReader.onloadend = (e) => {
      
      var separarTipoDato=myReader.result.toString().split("base64,")
      this.archivoBase64 = separarTipoDato[1];
      // //////////////////////////console.log(this.archivoBase64)

      
      var nombreProceso="PV";
      switch (nombrecampo) {
        case "adjContratoFinan":
          this.nomAdjContratoFinanciamiento =inputValue.files[0].name;
          this.documentosAdjuntarBase64[0]={
            "fileName":this.nomAdjContratoFinanciamiento,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "adjDniFrontal":
          this.nomAdjDniFrontal = inputValue.files[0].name;

          this.documentosAdjuntarBase64[1]={
            "fileName":this.nomAdjDniFrontal,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "adjDniPosterior":
          this.nomAdjDniPosterior = inputValue.files[0].name;
          this.documentosAdjuntarBase64[2]={
            "fileName":this.nomAdjDniPosterior,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "adjTarjetaFrontal":
          this.nomAdjTarjetaFrontal = inputValue.files[0].name;
          this.documentosAdjuntarBase64[3]={
            "fileName":this.nomAdjTarjetaFrontal,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "adjTarjetaPosterior":
          this.nomAdjTarjetaPosterior = inputValue.files[0].name;
          this.documentosAdjuntarBase64[4]={
            "fileName":this.nomAdjTarjetaPosterior,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "adjConInf":
          this.nomAdjConsentimientoInformado = inputValue.files[0].name;
          this.documentosAdjuntarBase64[5]={
            "fileName":this.nomAdjConsentimientoInformado,
            "fileBase64":this.archivoBase64,
            "processType":nombreProceso,
            "nombreDocumento":nombrecampo,
            "idEstado":21
          }
          break;
        case "adjDueñoVehiculo":
          this.nomAdjDueioVehiculo = inputValue.files[0].name;
          this.documentosAdjuntarBase64[6]={
            "fileName":this.nomAdjDueioVehiculo,
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

  guardarDocumentos(idReglaKnockout:number,archivos:any,mensaje:any){

   

    this.cargaDocumentoRKModel.idCliente=idReglaKnockout
    this.cargaDocumentoRKModel.archivos=archivos

    ////////////////////console.log(JSON.stringify(this.cargaDocumentoRKModel))

    this.cargaDocumentoService.registrarCargaDocumentosSF(this.cargaDocumentoRKModel).subscribe(resp =>{

      // //////////////////////////console.log("MENSAJE GUARDAR DOCS: "+JSON.stringify(resp))
      if (resp.valid) {
        // this.commonService.getSuccessHtmlList(mensaje,'/gnv/preevaluacion'); 
        if (this.knockoutModel.idEstadoPrevaluacion==4) {
          this.generarNumeroExpediente(idReglaKnockout,this.formDatosUsuario.get('numeroDocumento').value,this.datosUsuario.id,mensaje)
        }else{
          let respuesta = [];
          respuesta.push(resp.message);
          this.commonService.getSuccessHtmlList(respuesta,'/gnv/preevaluacion'); 
        }
        
      } else {
        let errors = [];
        errors.push('Se generó un error al guardar los documentos, intente nuevamente.');
        this.commonService.getErrorHtmlList(errors); 
      }

    })

  }

  guardarDocumentosAV(idReglaKnockout:number,archivos:any){

    this.cargaDocumentoRKModel.idCliente=idReglaKnockout
    this.cargaDocumentoRKModel.archivos=archivos

    ////////console.log(JSON.stringify(this.cargaDocumentoRKModel))

    this.cargaDocumentoService.registrarCargaDocumentosSF(this.cargaDocumentoRKModel).subscribe(resp =>{

      if (resp.valid) {
        let respuesta = [];
        respuesta.push(resp.message)
        this.commonService.getSuccessHtmlList(respuesta,'/gnv/preevaluacion'); 
      } else {
        let errors = [];
        errors.push('Se generó un error al guardar los documentos, intente nuevamente.');
        this.commonService.getErrorHtmlList(errors); 
      }

    })

  }

  validacionesDocumentos(){
    // this.guardarDocumentos(id,this.documentosBase64)
    let errors = [];
    var mensajeComplemento=" esta vacío."

    var documentoLlenos=[];
    for (let i = 0; i < this.documentosBase64.length; i++) {
      // //////////////////////////console.log(Object.keys(this.listProductoPorCliente).length)
      if (Object.keys(this.documentosBase64[i]).length === 0) {
        
        // i==0?errors.push(this.nobFileFormDatos+mensajeComplemento):
        // i==1?errors.push(this.nobFileContFinan+mensajeComplemento):
        // i==2?errors.push(this.nobFileFormConfor+mensajeComplemento):
        // i==3?errors.push("DNI"+mensajeComplemento):
        // i==4?errors.push("SOAT vigente"+mensajeComplemento):""
        // delete this.documentosBase64[i]; // Removes json.foo from the dictionary.s
        // JSON.parse(JSON.stringify(this.documentosBase64).sp)

      }else{
        documentoLlenos.push(this.documentosBase64[i])
      }
      
    }

    this.documentosBase64=documentoLlenos;
    //////////////////console.log(JSON.stringify(this.documentosBase64))

    //////////////////////////console.log("JSON: "+JSON.stringify(this.documentosBase64))
    if (Object.keys(errors).length === 0) {
      //Sigue proceso de guardado
      this.registrarReglas();
    } else{this.commonService.getErrorHtmlList(errors);}
    
  }

  //AV: Asesor de Ventas
  validacionesDocumentosAdjuntarAV(){
    // this.guardarDocumentos(id,this.documentosBase64)
    let errors = [];
    var mensajeComplemento=" esta vacío."
    var documentoLlenos=[];

    //Validar con Tipo Producto = 1 y 3 validar documento 5 y 6 importantes adjuntar 
    //this.idTipoProducto

    
    //Validar con si es dueño del vehiculo 
    //No: importante adjuntar documento 3 y 4
    //this.ocultarAdjuntarConformidad

      
      for (let i = 0; i < this.documentosAdjuntarBase64.length; i++) {
        // ////////////console.log("CANTIDAD DE DATOS LL: "+this.documentosBase64.length)
        // ////////////console.log(this.documentosBase64[i]['nombreDocumento'])
        if (Object.keys(this.documentosAdjuntarBase64[i]).length == 0) {
  
          // ////////////console.log(JSON.stringify(this.documentosBase64))
          if (JSON.stringify(this.documentosAdjuntarBase64[i])=="{}") {
            // ////////////console.log("VACIO "+i)
            switch (i) {
              case 0:
                if (this.documentosAdjuntarBase64[i]['nombreDocumento']==undefined) {
                  errors.push(this.nobContratoFinanciamiento+mensajeComplemento)
  
                }
                break;
              case 1:
                if (this.documentosAdjuntarBase64[i]['nombreDocumento']==undefined) {
                  errors.push(this.nobDniFrontal+mensajeComplemento)
                }
                break;
              case 2:
                if (this.documentosAdjuntarBase64[i]['nombreDocumento']==undefined) {
                  errors.push(this.nobDniPosterior+mensajeComplemento)
                }
                break;
              case 3:
                if (this.documentosAdjuntarBase64[i]['nombreDocumento']==undefined) {
                  if (this.idTipoProducto==4 || this.idTipoProducto==1 || this.idTipoProducto==3 ) {
                    errors.push(this.nobTarjetaFrontal+mensajeComplemento)
                  }
                  
                }
                break;
              case 4:
                if (this.documentosAdjuntarBase64[i]['nombreDocumento']==undefined) {
                  if (this.idTipoProducto==4 || this.idTipoProducto==1 || this.idTipoProducto==3  ) {
                    errors.push(this.nobTarjetaPosterior+mensajeComplemento)
                  }
                  
                }
                break;
              case 5:
 
                if (this.ocultarAdjuntarConformidad==false) {
                    errors.push(this.nobConsentimientoInformado+mensajeComplemento)
                }
  
                break;
              case 6:

                if (this.ocultarAdjuntarConformidad==false) {
                    errors.push(this.nobDueioVehiculo+mensajeComplemento)
                }
  
                break;
            
              default:
                break;
            }
          }
          
    
        }
        else{
          documentoLlenos.push(this.documentosAdjuntarBase64[i])
        }
        
      }


    //////////////////////////console.log("JSON: "+JSON.stringify(this.documentosBase64))
    if (Object.keys(errors).length === 0) {
      //Sigue proceso de guardado
      this.documentosAdjuntarBase64=documentoLlenos;
      this.guardarDocumentosAV(this.dataPreevaluacion.idPreevaluacion,this.documentosAdjuntarBase64)
    } else{
      this.commonService.getErrorHtmlList(errors);
    }
    
  }
  

  generarNumeroExpediente(idReglaKnockout:number,numeroDocumento:string,usuarioRegistro:number,mensaje:any){

    numeroDocumento=this.formDatosUsuario.get('numeroDocumento').value;
    var expediente=""
    const hoy = new Date();
    var año=hoy.getFullYear().toString()
    var mes=(hoy.getMonth()+ 1).toString().length==1?"0"+(hoy.getMonth()+ 1).toString():(hoy.getMonth()+ 1).toString()
    expediente=año+mes+idReglaKnockout+numeroDocumento
    // //////////////////////////console.log(expediente)

    //Guardar registro evaluacion cliente
    this.registrarEvaluacionCliente(idReglaKnockout,expediente,usuarioRegistro,mensaje)

  }
  registrarEvaluacionCliente(idReglaKnockout:number,numeroExpediente:string,usuarioRegistro:number,mensaje:any){
    this.evaluacionClienteModel={
      idReglaNockout:idReglaKnockout,
      numExpediente:numeroExpediente,
      idEstado:3,
      usuarioRegistro:usuarioRegistro,
      observacion:""
    }



    //console.log("JSON registrarEvaluacionCliente: "+JSON.stringify(this.evaluacionClienteModel))
    this.evaluacionClienteService.postRegisterEvaluacionCliente(this.evaluacionClienteModel).subscribe(resp =>{
      // //////////////////////////console.log("RPT JSON registrarEvaluacionCliente: "+JSON.stringify(resp))
      if (resp.valid) {
        this.commonService.getSuccessHtmlList(mensaje,'/gnv/preevaluacion'); 
      } else {
        let errors = [];
        errors.push('Se generó un error al registrar la evaluacion cliente, intente nuevamente.');
        this.commonService.getErrorHtmlList(errors); 
      }

    })
  }

  RedireccionarURl(clave:string){
    this.maestro=({
      keyUser:clave
    })
    this.maestroService.getMaestroByClave(this.maestro).subscribe(resp =>{
      // //////////////////////////console.log("RPT JSON registrarEvaluacionCliente: "+JSON.stringify(resp))
      if ((resp.valor).indexOf("http")>= 0) {
        var url=resp.valor
        var win = window.open(url, '_blank');
        // Cambiar el foco al nuevo tab (punto opcional)
        win.focus();
      }


    })
    // var url=""
    // var win = window.open(url, '_blank');
    // // Cambiar el foco al nuevo tab (punto opcional)
    // win.focus();
  }

  consultarMontoMinMax(){

    this.maestro=({
      keyUser:"IMPORTE_FINANCIAMIENTO"
    })

    this.maestroService.getMaestroByClave(this.maestro).subscribe(resp =>{
      this.montoMinimoMaximo=resp.valor.split(',')
      

      this.validarPreevaluacionSF(this.idPreevaluacion)


    })
  }


  validarAdjuntoConformidad(){
    //alert(this.idPreevaluacion)
    this.reglasKnockoutService.getValidarDocumento(this.idPreevaluacion).subscribe(resp =>{
      ////////console.log("RPT JSON validarAdjuntoConformidad: "+JSON.stringify(resp))


      if (resp.valid) {
        
      }else{
        // abrirModal
        ////////////console.log("EMAIL ASESOR")
        ////////////console.log(this.dataPreevaluacion.emailAsesor)

        var datosEnviar={
          idSfCliente:resp.idSfCliente,
          rol:this.rolId,
          nombreCompleto:this.dataPreevaluacion.nombre+" "+this.dataPreevaluacion.apellido,
          correoAsesor:this.dataPreevaluacion.emailAsesor
        }
        //this.abrirAdjuntadoConformidad(resp.idSfCliente);
        this.abrirAdjuntadoConformidad(datosEnviar);
        ////////////console.log(JSON.stringify(datosEnviar))
      }


    })
  }

  abrirAdjuntadoConformidad(datosEnviar:any){
    

    ////////////////////////console.log(dato)

    // this.dialog.open(ModalPdfComponent);

    const dialogRef = this.dialog.open(ModalAdjuntarComponent, {
      // width:'50%',
      data: datosEnviar
    });

    dialogRef.afterClosed().subscribe(result => {
      ////////////////////////console.log('The dialog was closed');
    });
  }

  mostrarAlertaRechazo(campo:string){
    let errors = [];
    switch (campo) {
      case "vehiculoMultas":
        //SMSCAMBIAR 
        errors.push('El vehículo tiene Multas “graves”, se recomienda rechazar');
        this.commonService.getErrorHtmlList(errors);
        break;
      case "titularMultas":
        //SMSCAMBIAR 
        errors.push('El titular  tiene Multas “graves”, se recomienda rechazar');
        this.commonService.getErrorHtmlList(errors);
        break;
      case "ordenCaptura":
        //SMSCAMBIAR 
        errors.push('El titular  tiene orden de captura, se recomienda rechazar');
        this.commonService.getErrorHtmlList(errors);
        break;
      default:
        break;
    }
  }

  completarDatosCliente(){
    // //////////////////////////console.log(idPreevaluacion);
    // this.authorizesService.redirectGestionInformacion(idUsuario);
      var idUsuario=this.dataPreevaluacion.idUsuario
      var url=document.location.origin+"/gnv/registro-informacion/"+idUsuario+"/"+this.dataPreevaluacion.idProducto+"/"+this.dataPreevaluacion.idPreevaluacion
      /* var win = window.open(url, '_blank');
      // var win = window.open(url);
      // Cambiar el foco al nuevo tab (punto opcional)
      win.focus(); */

      this.window.open(url, "_blank")
      this.window.focus();
    
    
  }
  mostrarVencimientoSoat(flag:Boolean){
    this.ocultarVencimientoSoat=flag;
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

  descargarDocumentoUrl(direccion){
    var url=direccion.split("Financiamientos_GNV")
    
    //console.log(url)
    //console.log(this.urlVirtualDirectory)
    var urlDownload=this.urlVirtualDirectory+url[1];

    var win = window.open(urlDownload, '_blank');
      // Cambiar el foco al nuevo tab (punto opcional)
    win.focus();
  }

  consultarDocumentosAD(idPreevaluacion:number){
    this.evaluacionClienteService.getDocumentosEvaluacionCliente('PV',idPreevaluacion).subscribe(data => {
      this.listaDocumentosAdjuntadosAV=data
      /* ////////console.log(this.listaDocumentosAdjuntadosAV)
      ////////console.log(Object.keys(this.listaDocumentosAdjuntadosAV).length)
      ////////console.log(data.valid) */
      if (data.valid==false) {
        /* alert("SIN DATOS") */
        this.documentosAdjuntosLleno=false;
      }
      if (data.valid==undefined) {
        this.documentosAdjuntosLleno=true;
      }
    });
  }

  openDialogPdf(nombreDocumento:string){

    var dato=[];
    var existeDocumento=false;


    for (let i = 0; i < Object.keys(this.listaDocumentosAdjuntadosAV).length; i++) {

      ////////console.log(JSON.stringify(this.listaDocumentosAdjuntadosAV))
      
      if ( this.listaDocumentosAdjuntadosAV[i].nombreDocumento==nombreDocumento) {
        dato.push({
          "idCargaDocumento":this.listaDocumentosAdjuntadosAV[i].id,
          "tipoProcesoDucumento":"PA",
          "rootArchivo":this.listaDocumentosAdjuntadosAV[i].rootArchivo
        })
        existeDocumento=true;
      }
      
    }

    //////////console.log(dato)

    // this.dialog.open(ModalPdfComponent);

    if (Object.keys(this.listaDocumentosAdjuntadosAV).length<=0 || existeDocumento==false) {
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

  verPrevisualizacion(nombrecampo:string){

    var validacionDoc=true;
    var nombreTexto="";
    var documento;

    switch (nombrecampo) {
      case "fileSustento":
        documento=this.documentosBase64[0]
        nombreTexto=this.documentosBase64[0]['fileName']
        break;
      case "fileClienteTitular":
        documento=this.documentosBase64[1]
        nombreTexto=this.documentosBase64[1]['fileName']
        break;
      case "fileDniRegistradoReniec":
        documento=this.documentosBase64[2]
        nombreTexto=this.documentosBase64[2]['fileName']
        break;
      case "fileDniTitularContrato":
        documento=this.documentosBase64[3]
        nombreTexto=this.documentosBase64[3]['fileName']
        break;
      case "fileLicenciaConducirVigente":
        documento=this.documentosBase64[4]
        nombreTexto=this.documentosBase64[4]['fileName']
        break;
      case "fileTitularContratoPropietario":
        documento=this.documentosBase64[5]
        nombreTexto=this.documentosBase64[5]['fileName']
        break;
      case "fileSoatVigente":
        documento=this.documentosBase64[6]
        nombreTexto=this.documentosBase64[6]['fileName']
        break;
      case "fileVehiculoMultas":
        documento=this.documentosBase64[7]
        nombreTexto=this.documentosBase64[7]['fileName']
        break;
      case "fileTitularContrato":
        documento=this.documentosBase64[8]
        nombreTexto=this.documentosBase64[8]['fileName']
        break;
      case "fileVehiculoCaptura":
        documento=this.documentosBase64[9]
        nombreTexto=this.documentosBase64[9]['fileName']
        break;
      case "fileVehiculoGNV":
        documento=this.documentosBase64[10]
        nombreTexto=this.documentosBase64[10]['fileName']
        break;
    
      default:
        break;
    }

/*     var nombreTexto=this.documentosBase64[10]['fileName']; */
    if ((nombreTexto).indexOf(".pdf")>= 0) {
        //Encontr coincidencias
        validacionDoc=true
    }else{
        validacionDoc=false;
    }

    if (validacionDoc) {
      const dialogRefPrev = this.dialog.open(ModalPrevPdfComponent, {
        width:'80%',
        height:"90%",
        data: documento
      });
  
      dialogRefPrev.afterClosed().subscribe(result => {
        ////////////////////////console.log('The dialog was closed');
      });
    }

  }
}
