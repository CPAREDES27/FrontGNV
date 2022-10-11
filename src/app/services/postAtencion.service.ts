import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DescargaDocumentoModel } from '../models/descarga-documentos/descarga-documento.model';
import { EvaluacionClienteModel } from '../models/evaluacion-cliente/evaluacion-cliente.model';
import { DetalleEvaluacionCrediticiaModel } from '../models/evaluacion-crediticia/detalle-evaluacion-crediticia.model';
import { EvaluacionCrediticiaModel } from '../models/evaluacion-crediticia/evaluacion-crediticia-model';
import { RegistrarEvaluacionCrediticiaModel } from '../models/evaluacion-crediticia/registrar-evaluacion-creditica.model';
import { JsonResult } from '../models/json-result';
import { CargarDocumentoPostAtencionModel } from '../models/post-atencion/cargar-documentosPostAtencion.model';
import { DetallePostAtencionModel } from '../models/post-atencion/detalle-postAtencion.model';
import { PostAtencionModel } from '../models/post-atencion/postAtencion.model';


@Injectable({
  providedIn: 'root'
})
export class PostAtencionService {
  urlServicesGnv: string = environment.urlServicesGnv; 
  constructor(private httpClient: HttpClient) { }

  postListarPostAtencion(datosFormulario: PostAtencionModel): Observable<any> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Postattention/ListPostAttention`;  
    let httpParamsknockoutEntity = JSON.stringify(datosFormulario);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<any>(urlBackServiceGnv, httpParamsknockoutEntity, { headers: mheaders });  

  }

  getDetallePostAtencion(idPostAtencion:any):Observable<DetallePostAtencionModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Postattention/GetPostAttentionById?idPostAttention=${idPostAtencion}`;
    return this.httpClient.get<DetallePostAtencionModel>(urlBackServiceGnv)
  }

  getDocumentosEvaluacionCrediticia(idPreevaluacion:any):Observable<DescargaDocumentoModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}EvaluacionCrediticia/GetDetalleArchivos?idPreevaluacion=${idPreevaluacion}`;
    return this.httpClient.get<DescargaDocumentoModel>(urlBackServiceGnv)
  }

  postRegistrarEvaluacionCrediticia(datosFormulario: RegistrarEvaluacionCrediticiaModel): Observable<any> {
    const urlBackServiceGnv = `${this.urlServicesGnv}EvaluacionCrediticia/RegisterEvaluacionCrediticia`;  
    let httpParamsknockoutEntity = JSON.stringify(datosFormulario);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<any>(urlBackServiceGnv, httpParamsknockoutEntity, { headers: mheaders });  
  }

  postUploadDocumentPostAttention(datosFormulario: CargarDocumentoPostAtencionModel): Observable<JsonResult<any>> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Postattention/UploadDocumentPostAttention`;  
    let httpParamsknockoutEntity = JSON.stringify(datosFormulario);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParamsknockoutEntity, { headers: mheaders });  

  }

}
