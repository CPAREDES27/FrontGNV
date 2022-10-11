import { Injectable } from '@angular/core';
import { CorreoModel } from '../models/correo/correo.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonService } from './common.service';
import { CorreoService } from './correo.service';
import { environment } from 'src/environments/environment'; 
import { EvaluacionCrediticiaService } from './evaluacion-crediticia.service';
import { RegistrarEvaluacionCrediticiaModel } from '../models/evaluacion-crediticia/registrar-evaluacion-creditica.model';
import { PostAtencionService } from './postAtencion.service';
import { CargarDocumentoPostAtencionModel } from '../models/post-atencion/cargar-documentosPostAtencion.model';



@Injectable({
  providedIn: 'root'
})
export class EvCrediticaCargaPostService { 
  constructor(
      private httpClient: HttpClient,
      private correoService:CorreoService,
      private commonService:CommonService,
      private evaluacionCrediticiaService: EvaluacionCrediticiaService,
      private postAtencionService:PostAtencionService
      ) { }

      urlGNV=environment.urlPG; 

      messageSucces = [];
    //   registroEvaluacionCrediticia:RegistrarEvaluacionCrediticiaModel;
      cargaDocumentosPostAtencion:CargarDocumentoPostAtencionModel;

      registrarEvaluacionCreditia(registroEvaluacionCrediticia:RegistrarEvaluacionCrediticiaModel){

        this.messageSucces=[];

        // //////////////console.log(JSON.stringify(registroEvaluacionCrediticia))
        this.evaluacionCrediticiaService.postRegistrarEvaluacionCrediticia(registroEvaluacionCrediticia).subscribe(response => {
          // //////////////console.log("RPT EV CREDITICIA")
          // //////////////console.log(response)
          if (response.valid) {
            this.messageSucces.push(response.message)
            this.commonService.getSuccessHtmlList(this.messageSucces,'/gnv/evaluacion-cliente'); 
            
          } else {
            let errors = [];
            errors.push(response.message);
            this.commonService.getErrorHtmlList(errors); 
          }
    
      })
      }

      registrarCargaPostAtencion(cargaDocumentosPostAtencion:CargarDocumentoPostAtencionModel){

        this.messageSucces=[];
        ////////////////////console.log(JSON.stringify(cargaDocumentosPostAtencion))
        this.postAtencionService.postUploadDocumentPostAttention(cargaDocumentosPostAtencion).subscribe( 
            response =>{
              ////////////////////console.log(response)

              if (response.valid) {
                  this.messageSucces.push(response.message)
                  this.commonService.getSuccessHtmlList(this.messageSucces,'/gnv/evaluacion-cliente'); 
                } else {
                  let errors = [];
                  errors.push(response.message);
                  this.commonService.getErrorHtmlList(errors); 
                }

            }
      
          )

      }
 
}
