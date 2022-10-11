import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import { EstadoModel } from 'src/app/models/estados/estado.model';
import { DetalleEvaluacionCrediticiaModel } from 'src/app/models/evaluacion-crediticia/detalle-evaluacion-crediticia.model';
import { RegistrarEvaluacionCrediticiaModel } from 'src/app/models/evaluacion-crediticia/registrar-evaluacion-creditica.model';
import { LineaCreditoModel } from 'src/app/models/linea-credito/linea-credito';
import { MaestroModel } from 'src/app/models/maestro/maestro.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { CommonService } from 'src/app/services/common.service';
import { EstadosService } from 'src/app/services/estados.service';
import { EvaluacionCrediticiaService } from 'src/app/services/evaluacion-crediticia.service';
import { MaestroService } from 'src/app/services/maestro.service';
import { ReglasKnockoutService } from 'src/app/services/reglas-knockout.service';
import { GlobalVariable } from '../../global';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-det-eva-cred',
  templateUrl: './det-eva-cred.component.html',
  styleUrls: ['./det-eva-cred.component.scss']
})
export class DetEvaCredComponent implements OnInit {
  formDatosUsuario : FormGroup;  
  formDatosRegistro : FormGroup;  
  
  idEvaluacionCliente = 0;
  tipoDocumento="";
  documento="";
  idPreevaluacion:number=0;
  ocultarTresPreguntasNo:boolean=false;
  numeroBancosSi:boolean=false;
  sinCalificacion:boolean=false;
  deficiente:boolean=false;
  dudosoPerdidad:boolean=false;
  numeroBancosNo:boolean=false;
  deudaSi:boolean=false;
  deudaNo:boolean=false;
  valorNumeroVrDeudaSBS:number=0;
  numeroScoreActual:number=0;
  numeroScore:number=0;
  numeroExpediente:string='';
  scoreMinimo:string[]=[]

  listaEstados:EstadoModel;
  registroEvaluacionCrediticia:RegistrarEvaluacionCrediticiaModel;

  datosUsuario:AuthorizeModel;

  messageSucces = [];

  dataEvaluacionCrediticia:DetalleEvaluacionCrediticiaModel;

  ocultarBotonGuardar:boolean=false;

  montoMinimoMaximo:string[]=[]

  maestro:MaestroModel;

  opcionVrDeudaSBS:number=0;

  ocultarTresPreguntas:boolean=false;

  lineaCredito:LineaCreditoModel={
    lineaCredito:0,
    riesgo:"-"
  }
  constructor(
    private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private evaluacionCrediticia:EvaluacionCrediticiaService,
    private datePipe: DatePipe,
    private authorizesService:AuthorizesService,
    private estadoService:EstadosService,
    private commonService:CommonService,
    private maestroService:MaestroService,
    private reglasKnockoutService:ReglasKnockoutService
    ) { }

  ngOnInit(): void {

    this.registroEvaluacionCrediticia={
      informacionCR:1,
     
    }

    this.route.params.subscribe(data=>{
      this.idEvaluacionCliente = data['id'];
      this.tipoDocumento = data['tipoDocumento'];
      this.documento = data['documento'];
     //this.obtenerDatos(this.idPreevaluacion);
    });

    this.formularioDatos();
    // this.cargarDataForm();

    /* this.formularioDatosRegsitro(); */
    this.formDataRegistro();
    this.consultarDatosEvaluacion();
    this.listarEstados();

    this.obtenerDatosUSerLogeado();

    this.consultarMontoMinMax();
    this.consultarScoreMinimoMaximo()
  }

  formularioDatos(){
    // this.formDatosUsuario = new FormGroup({
    //   productoFinanciado:new FormControl(),
    //   productoFinanciadoPrecio:new FormControl(),
    //   productoFinanciadoProveedor:new FormControl(),
    //   nombres:new FormControl(),
    //   apellidos:new FormControl(),
    //   dni:new FormControl(),
    //   fechNacimiento:new FormControl(),
    //   nacionalidad:new FormControl(),
    //   telefono:new FormControl(),
    //   celular:new FormControl(),
    //   email:new FormControl(),
    //   vrDeudaSBS:new FormControl(),
    //   vrDeudaIngreso:new FormControl(),
    //   vrReporteDeudaSBS:new FormControl(),
    // });
    this.formDatosUsuario = this.formBuilder.group({
      productoFinanciado: ['',Validators.required],
      productoFinanciadoPrecio: ['',Validators.required],
      productoFinanciadoProveedor: ['',Validators.required],
      nombres: ['',Validators.required],
      apellidos: ['',Validators.required],
      dni: ['',Validators.required],
      fechNacimiento: ['',Validators.required],
      nacionalidad: ['',Validators.required],
      telefono: ['',Validators.required],
      celular: ['',Validators.required],
      email: ['',Validators.required],
      informacionCR: ['',Validators.required],
      vrDeudaSBS: ['',Validators.required],
      vrDeudaIngreso: ['',Validators.required],
      vrReporteDeudaSBS: ['',Validators.required]
    });
  }

  listarEstados(){
    this.estadoService.getListEstados("EvaluacionCrediticia").subscribe(response => {
      this.listaEstados=response;
    })
  }

  // cargarDataForm(){
  //   this.formDatosUsuario = this.formBuilder.group({
  //     nombres: [{value: 'Eduardo Javier',disabled: true}],
  //     apellidos: [{value: 'Aguirre Calamares',disabled: true}],
  //     dni: [{value: '09834702',disabled: true}],
  //     fechNacimiento: [{value: '17/02/1965',disabled: true}],
  //     nacionalidad: [{value: 'Peruana',disabled: true}],
  //     telefono: [{value: '017659862',disabled: true}],
  //     celular: [{value: '987654234',disabled: true}],
  //     email: [{value: 'edujavier@gmail.com',disabled: true}],
     
  //   });
  // }

  /* formularioDatosRegsitro(){
    this.formDatosRegistro = new FormGroup({
      // estadoEvaluacion:new FormControl(),
      observaciones: new FormControl()
    });
  } */

  formDataRegistro(){
    this.formDatosRegistro = this.formBuilder.group({
      // estadoEvaluacion: ['',Validators.required],
      observaciones: [''],
    });
  }

  consultarDatosEvaluacion(){
   
    this.evaluacionCrediticia.getDetalleEvaluacionCrediticia(this.idEvaluacionCliente,this.tipoDocumento,this.documento).subscribe(data => {
     
      this.idPreevaluacion=data.idPreevaluacion;
    
      this.numeroScoreActual=data.numeroScrore
      this.numeroScore=data.numeroScrore

      this.dataEvaluacionCrediticia=data;
      this.numeroExpediente=this.dataEvaluacionCrediticia.numExpediente;
      ////////////////////////console.log("IDP PREEVAUACION: "+this.idPreevaluacion)
      this.formDatosUsuario = this.formBuilder.group({
        productoFinanciado:[{value: this.dataEvaluacionCrediticia.nombreProducto,disabled: true}],
        productoFinanciadoPrecio:[{value: this.dataEvaluacionCrediticia.precioProducto,disabled: true}],
        productoFinanciadoProveedor:[{value: this.dataEvaluacionCrediticia.nombreProveedor,disabled: true}],
        nombres: [{value: this.dataEvaluacionCrediticia.nombres,disabled: true}],
        apellidos: [{value: this.dataEvaluacionCrediticia.apellidos,disabled: true}],
        dni: [{value: this.dataEvaluacionCrediticia.numDocumento,disabled: true}],
        fechNacimiento: [{value: this.datePipe.transform(this.dataEvaluacionCrediticia.fechaNacimiento,'dd/MM/yyyy'),disabled: true}],
        nacionalidad: [{value: 'Peruana',disabled: true}],
        telefono: [{value: this.dataEvaluacionCrediticia.telefonoFijo,disabled: true}],
        celular: [{value: this.dataEvaluacionCrediticia.telefonoMovil,disabled: true}],
        email: [{value: this.dataEvaluacionCrediticia.usuarioEmail,disabled: true}],
        informacionCR: ['',Validators.required],
        vrDeudaSBS: ['',Validators.required],
        vrDeudaIngreso: ['',Validators.required],
        vrReporteDeudaSBS: ['',Validators.required]
      });

      this.formDatosRegistro= this.formBuilder.group({
        // estadoEvaluacion:[{value: null,disabled: false}],
        observaciones:[{value: this.dataEvaluacionCrediticia.observaciones,disabled: false}],
      })

      // if (this.dataEvaluacionCrediticia.idEstado==15 || this.dataEvaluacionCrediticia.idEstado==16 ) {
      //   this.ocultarBotonGuardar=true;
      // }
 
      if(this.dataEvaluacionCrediticia.infoCR===true){
      
        this.ocultarTresPreguntas=true;
        this.ocultarTresPreguntasNo=false;
        this.consultarLineaCredito(this.numeroScoreActual,"SI")
        if(this.dataEvaluacionCrediticia.deudasMas6vecesIngreso==true){
          this.valorNumeroVrDeudaSBS-=10;
          this.deudaSi = true;
          this.deudaNo= false;
        }else{
          this.valorNumeroVrDeudaSBS-=0;
          this.deudaSi=false;
          this.deudaNo=true;
        }
        if(this.dataEvaluacionCrediticia.deudaMas6Entidades==true){
          this.numeroBancosSi=true;
          this.numeroBancosNo=false;
          this.valorNumeroVrDeudaSBS-=10;
        }else{
          this.numeroBancosSi=false;
          this.numeroBancosNo=true;
        }
        if(this.dataEvaluacionCrediticia.reporteDeudaSBS=="Sin Calificación y Con Problemas Potenciales"){
          this.sinCalificacion =true;
          this.deficiente =false;
          this.dudosoPerdidad=false;
          this.valorNumeroVrDeudaSBS-=10;
        }else if(this.dataEvaluacionCrediticia.reporteDeudaSBS=="Deficiente"){
          this.sinCalificacion =false;
          this.deficiente =true;
          this.dudosoPerdidad=false;
          this.valorNumeroVrDeudaSBS-=25;
        }else if(this.dataEvaluacionCrediticia.reporteDeudaSBS="Dudoso y Pérdida"){
          this.dudosoPerdidad=true;
          this.deficiente =false;
          this.sinCalificacion =false;
          this.valorNumeroVrDeudaSBS-=-40;
        }
        this.restarNumeroSocreTiempoReal();
      }else{
        this.valorNumeroVrDeudaSBS-=0;
        this.ocultarTresPreguntas=false;
        this.ocultarTresPreguntasNo=true;
        this.consultarLineaCredito(this.numeroScoreActual,"NO")
      }
    
      
      if (this.dataEvaluacionCrediticia.informacionCR==0) {
        this.consultarLineaCredito(this.numeroScore,"No")
      }
      if (this.dataEvaluacionCrediticia.informacionCR==1) {
        this.consultarLineaCredito(this.numeroScore,"Si")
      }

    });

  }

  verDetalleDocumentoCreditica(){

    // //////////////////////////console.log(idPreevaluacion);
    this.authorizesService.redirectDetalleEvaluacionCreditica(this.idEvaluacionCliente,'','',"Documento",this.idPreevaluacion);
  }


  consultarScoreMinimoMaximo(){

    this.maestro=({
      keyUser:"NUMERO_SCORE"
    })

    this.maestroService.getMaestroByClave(this.maestro).subscribe(resp =>{
      this.scoreMinimo=resp.valor.split(',')

      

    })
  }
 
  guardarEvaluacionCrediticia(){
    var estadoEvCrediticia=0

    

    if (this.numeroScoreActual<=parseInt(this.scoreMinimo[0])) {
      //estado rechazado
      estadoEvCrediticia=16
    }else{
      //estado aceptado
      estadoEvCrediticia=15
    }
    console.log(this.formDatosUsuario.get("informacionCR").value)
    //CPAREDES -QUITAR VALIDACION
    // if (this.formDatosUsuario.get("informacionCR").value.toString()=='') {
    //     let errors = [];
    //     errors.push("Responder ¿El cliente cuenta con información en CR?");
    //     this.commonService.getErrorHtmlList(errors); 
    //     return
    // }

    if (this.formDatosUsuario.get("informacionCR").value.toString()=="1") {
      //VALIDAR IMPORTANTE
      this.registroEvaluacionCrediticia={
        idEvCliente:this.idEvaluacionCliente,
        entidadSBS:this.formDatosUsuario.get('vrDeudaSBS').value,
        valorDeuda:this.formDatosUsuario.get('vrDeudaIngreso').value,
        reporteSBS:this.formDatosUsuario.get('vrReporteDeudaSBS').value,
        idEstado:estadoEvCrediticia,
        usuarioRegistro:this.datosUsuario.id,
        observaciones:this.formDatosRegistro.get("observaciones").value,
        informacionCR:1,
        lineaCredito:this.lineaCredito.lineaCredito
      }
    }else{
      //VALIDAR IMPORTANTE
      this.registroEvaluacionCrediticia={
        idEvCliente:this.idEvaluacionCliente,
        entidadSBS:0,
        valorDeuda:0,
        reporteSBS:0,
        idEstado:estadoEvCrediticia,
        usuarioRegistro:this.datosUsuario.id,
        observaciones:this.formDatosRegistro.get("observaciones").value,
        informacionCR:0,
        lineaCredito:this.lineaCredito.lineaCredito
      }
    }

    console.log(JSON.stringify(this.registroEvaluacionCrediticia))
    //////////////////console.log(JSON.stringify(this.registroEvaluacionCrediticia))
    this.evaluacionCrediticia.postRegistrarEvaluacionCrediticia(this.registroEvaluacionCrediticia).subscribe(response => {
      ////////////////////////console.log(response)
      if (response.valid) {
        this.messageSucces.push(response.message)
        this.commonService.getSuccessHtmlList(this.messageSucces,'/gnv/evaluacion-crediticia'); 
      } else {
        let errors = [];
        errors.push(response.message);
        this.commonService.getErrorHtmlList(errors); 
      }

    })
  }

  obtenerDatosUSerLogeado(){
    this.datosUsuario=this.authorizesService.getUserAuth();
  }

  consultarMontoMinMax(){

    this.maestro=({
      keyUser:"IMPORTE_FINANCIAMIENTO"
    })

    this.maestroService.getMaestroByClave(this.maestro).subscribe(resp =>{
      this.montoMinimoMaximo=resp.valor.split(',')
      
      this.validarRealizoSF();
    })
  }

  validarRealizoSF(){
    
        
    var montoMinimo=parseInt(this.montoMinimoMaximo[0])
    var montoMaximo=parseInt(this.montoMinimoMaximo[1])

    //Menor a 2000
    if (this.dataEvaluacionCrediticia.precioProducto<=montoMinimo) {


      // this.consultarDatosAdicionalesCliente();
      

    }else if (this.dataEvaluacionCrediticia.precioProducto>montoMinimo && this.dataEvaluacionCrediticia.precioProducto<=montoMaximo) {
      //Mostrara mensaje
     
      //Consultar WS y validar
      // ////////////////console.log("IDPREEVALUACION: "+this.dataEvaluacionCliente.idPreevaluacion)
      this.reglasKnockoutService.getValidarPreevaluacionExisteSF(this.dataEvaluacionCrediticia.idPreevaluacion).subscribe(data => {

        if (!data.valid) {
          // this.deshabilitarFormulario=false;
          // this.formDatosUsuario.disable();
          // this.formDatosEstado.disable();

          // this.formReglasKnockout.disable();
          this.ocultarBotonGuardar=true;
        let errors = [];
        errors.push(GlobalVariable.usuarioNoCompleto40Preguntas);
        this.commonService.getErrorHtmlList(errors);
        }
  
      });


    }else if (this.dataEvaluacionCrediticia.precioProducto>montoMaximo) {
      //Monto mayor al monto maximo
      //Enviar una alerta
      //El importe del producto supera el maximo permitido 
      let errors = [];
      errors.push('El importe del producto supera el máximo permitido.');
      this.commonService.getErrorHtmlList(errors); 
      // alert("El importe del producto supera el maximo permitido ")
    }
  }

  restarNumeroSocreTiempoReal(){
    //////////console.log("valorNumeroVrDeudaSBS: "+valorNumeroVrDeudaSBS)
    //////////console.log("valorNumeroVrDeudaIngreso: "+valorNumeroVrDeudaIngreso)
    //////////console.log("valorNumeroVrReporteDeudaSBS: "+valorNumeroVrReporteDeudaSBS)
    var total=(this.valorNumeroVrDeudaSBS=undefined?0:this.valorNumeroVrDeudaSBS).toString();
    //////////console.log(total)

    this.numeroScoreActual=this.numeroScore+(parseInt(total))

    if (this.formDatosUsuario.get('informacionCR').value.toString()=="1") {
      this.consultarLineaCredito(this.numeroScoreActual,"Si")
    }
    if (this.formDatosUsuario.get('informacionCR').value.toString()=="0") {
      this.consultarLineaCredito(this.numeroScoreActual,"No")
    }

    
  }

  // validarRespuestaCR(dato:string){
  //   if (dato=="Si") {
  //     this.ocultarTresPreguntas=true;
  //   }else{
  //     this.ocultarTresPreguntas=false;
  //     this.numeroScoreActual=this.dataEvaluacionCrediticia.numeroScrore
  //     this.formDatosUsuario.patchValue({
  //       vrDeudaSBS: ['',Validators.required],
  //       vrDeudaIngreso: ['',Validators.required],
  //       vrReporteDeudaSBS: ['',Validators.required]
  //     })
  //   }

  //   this.consultarLineaCredito(this.numeroScoreActual,dato)
  // }

  consultarLineaCredito(score:number,valorCR:string){

    this.maestroService.getLineaCredito(score,valorCR).subscribe(resp =>{
      this.lineaCredito=resp;
    })
  }

}
