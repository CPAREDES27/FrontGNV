import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { json } from '@rxweb/reactive-form-validators';
import { CargaDocumentoModel } from 'src/app/models/carga-documentos/cargaDocumento.model';
import { ActualizarEstadoModel } from 'src/app/models/estados/actualizar-estado.model';
import { EstadoModel } from 'src/app/models/estados/estado.model';
import { CargaDocumentosService } from 'src/app/services/cargaDocumentos.service';
import { CommonService } from 'src/app/services/common.service';
import { CorreoPlantillaService } from 'src/app/services/correo-plantilla.service';
import { EstadosService } from 'src/app/services/estados.service';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-modal-adjuntar',
  templateUrl: './modal-adjuntar.component.html',
  styleUrls: ['./modal-adjuntar.component.scss']
})
export class ModalAdjuntarComponent implements OnInit {

  

  rutaPDF = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  nombFilePdf = "Volver a adjuntar el documento"
  dataword="";
  
  listaEstados:EstadoModel;
  formDocumentos : FormGroup;  

  actualizarDocumentoModel:ActualizarEstadoModel;
  urlVirtualDirectory: string = environment.urlVirtualDirectory; 

  messageSuccess = [];

  FormularioConformidad: FormGroup;

  //Transformar a base64
  archivoBase64:string="";
  documentosBase64=[{}];

  cargaDocumentoModel:CargaDocumentoModel;

  nombFileConformidad="Consentimiento Informado";

  constructor(
    public dialogRef: MatDialogRef<ModalAdjuntarComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data,
    private estadoService:EstadosService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private cargaDocumentoService:CargaDocumentosService,
    private correoPlantilla:CorreoPlantillaService

  ) { }

  ngOnInit(): void {
    webPreferences: {
      webSecurity: false
    }
    //////////////////////console.log(this.data)
    this.crearFormularioConformidad();
   
  }

  

  crearFormularioConformidad() {
    this.FormularioConformidad = new FormGroup({
      fileFormConformidad : new FormControl(Validators.required)
   });
  }


  uploadFileFormDatos(event,nombrecampo:string) {
    this.transformarBase64(event.target,nombrecampo)
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
        case "fileFormConformidad":
          this.nombFileConformidad=inputValue.files[0].name
          this.documentosBase64[0]={
            "fileName":inputValue.files[0].name,
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


  guardarDocumentoSF(){
    this.cargaDocumentoModel=({
      idCliente:this.data.idSfCliente,
      archivos:this.documentosBase64
    })

    ////////////console.log(this.cargaDocumentoModel)

    


  }

  enviarAlertaAsesorVentas(){

    this.correoPlantilla.enviarCorreoAlertaAsesor(
      this.data.nombreCompleto,
      [this.data.correoAsesor],
      "Complete o cargue el documento consentimiento informado.",
      "Consentimiento informado - "+ this.data.nombreCompleto,"SinRuta")

      this.dialogRef.close();
  }

}
