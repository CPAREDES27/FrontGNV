import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { json } from '@rxweb/reactive-form-validators';
import { ActualizarEstadoModel } from 'src/app/models/estados/actualizar-estado.model';
import { EstadoModel } from 'src/app/models/estados/estado.model';
import { CommonService } from 'src/app/services/common.service';
import { EstadosService } from 'src/app/services/estados.service';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-modal-pdf',
  templateUrl: './modal-pdf.component.html',
  styleUrls: ['./modal-pdf.component.scss']
})
export class ModalPdfComponent implements OnInit {

  

  rutaPDF = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  nombFilePdf = "Volver a adjuntar el documento"
  dataword="";
  
  listaEstados:EstadoModel;
  formDocumentos : FormGroup;  

  actualizarDocumentoModel:ActualizarEstadoModel;
  urlVirtualDirectory: string = environment.urlVirtualDirectory; 

  messageSuccess = [];

  constructor(
    public dialogRef: MatDialogRef<ModalPdfComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data,
    private estadoService:EstadosService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,

  ) { }

  ngOnInit(): void {
    webPreferences: {
      webSecurity: false
    }
    ////////////////////////console.log("DATA: "+JSON.stringify(this.data))
    var rutaArchivo=this.data.rootArchivo.split("Financiamientos_GNV")
    //////console.log(rutaArchivo[0])
    //////console.log(rutaArchivo[1])
    this.data.rootArchivo=this.urlVirtualDirectory+rutaArchivo[1];
    this.formularioDocumentos();
    this.listarEstados();
  }

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
      this.dataword = separarTipoDato[1];
      ////////////////////////console.log(this.dataword)
      this.downloadBase64File(this.dataword,'prueba','msword')

      // //////////////////////////console.log(myReader.result);
      // //////////////////////////console.log("ARCHIVOS A BASE 64: "+JSON.stringify(this.documentosBase64))
      
    }
    myReader.readAsDataURL(file);
  }

  downloadBase64File(contentBase64, fileName, fileExtension) {
    const linkSource = `data:application/`+fileExtension+`;base64,${contentBase64}`;
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);

    downloadLink.href = linkSource;
    downloadLink.target = '_self';
    downloadLink.download = fileName;
    downloadLink.click(); 
  }


  listarEstados(){
    this.estadoService.getListEstados("Documento").subscribe(response => {
      ////////////////////////console.log(response)
      this.listaEstados=response;
    })
  }

  formularioDocumentos(){

    this.formDocumentos = this.formBuilder.group({
      estadoDocumento: ['',Validators.required],
    });
  }

  actualizarDocumento(){
    //////console.log(JSON.stringify(this.data))
    //////console.log(this.data.idCargaDocumento)
    //////console.log(this.data.idCargaDocumento)
    this.actualizarDocumentoModel={
      idCargaDocumento:this.data.idCargaDocumento==undefined?this.data.id:this.data.idCargaDocumento,
      processType:this.data.tipoProcesoDucumento==undefined?this.data.tipoProcesoDocumento:this.data.tipoProcesoDucumento,
      idEstado:this.formDocumentos.get('estadoDocumento').value
    }

    //////console.log("DATA ACTUALIZAR: "+JSON.stringify(this.actualizarDocumentoModel))
    this.estadoService.actualizarEstado(this.actualizarDocumentoModel).subscribe(response => {
      ////////////////////////console.log("ACTUALIZAR")
      ////////////////////////console.log(response)

      if (response.valid) {
        this.messageSuccess.push(response.message)
        //////////////////////////console.log("RESPUESTA: "+JSON.stringify(response))
        this.commonService.getSuccessHtmlList(this.messageSuccess,'SinRuta'); 
        this.dialogRef.close();
      } else {
        let errors = [];
        errors.push(response.message);
        this.commonService.getErrorHtmlList(errors); 
      }

    })

  }


  descargarDocumento(url) {
    
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);

    downloadLink.href = url;
    // downloadLink.target = '_self';
    // downloadLink.download = fileName;
    downloadLink.click(); 
  }

 
  

}
