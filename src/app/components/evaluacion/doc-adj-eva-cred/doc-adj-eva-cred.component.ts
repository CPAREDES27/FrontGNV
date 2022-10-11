import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { CommonService } from 'src/app/services/common.service';
import { EvaluacionCrediticiaService } from 'src/app/services/evaluacion-crediticia.service';
import { ModalPdfComponent } from '../modal-pdf/modal-pdf.component';

@Component({
  selector: 'app-doc-adj-eva-cred',
  templateUrl: './doc-adj-eva-cred.component.html',
  styleUrls: ['./doc-adj-eva-cred.component.scss']
})
export class DocAdjEvaCredComponent implements OnInit {

  evaluacionCliente;
  listaDocumentos:any=[];
  
  constructor(
    private dialog: MatDialog,
    private route:ActivatedRoute,
    private authorizesService:AuthorizesService,
    private evaluacionCrediticaService:EvaluacionCrediticiaService,
    private commonService: CommonService,
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(data=>{
      // ////////////////////////console.log(data)
      this.evaluacionCliente=data;
      // this.idEvaluacionCliente = data['id'];
     //this.obtenerDatos(this.idPreevaluacion);
    });

    this.consultarDatosEvaluacion();
  }


  openDialogPdf(nombreDocumento:string){

    var dato=[];
    var existeDocumento=false;


    for (let i = 0; i < this.listaDocumentos.length; i++) {
      
      if ( this.listaDocumentos[i].nombreDocumento==nombreDocumento) {
        dato.push(this.listaDocumentos[i])
        existeDocumento=true;
      }
      
    }

    ////////////////////////console.log(dato)

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

  verDetalleEvaluacionCreditica(){

    // //////////////////////////console.log(idPreevaluacion);
    this.authorizesService.redirectDetalleEvaluacionCreditica(this.evaluacionCliente.id,'','',"Detalle",0);
  }

  consultarDatosEvaluacion(){
    this.evaluacionCrediticaService.getDocumentosEvaluacionCrediticia(this.evaluacionCliente.idPreevaluacion).subscribe(data => {
      ////////////////////////console.log(data)
      this.listaDocumentos=data
    });
  }


}
