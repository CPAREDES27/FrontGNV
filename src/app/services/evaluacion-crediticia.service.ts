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


@Injectable({
  providedIn: 'root'
})
export class EvaluacionCrediticiaService {
  urlServicesGnv: string = environment.urlServicesGnv; 
  constructor(private httpClient: HttpClient) { }

  postListarEvaluacionCrediticia(datosFormulario: EvaluacionCrediticiaModel): Observable<any> {
    const urlBackServiceGnv = `${this.urlServicesGnv}EvaluacionCrediticia/ListEvaluationclient`;  
    let httpParamsknockoutEntity = JSON.stringify(datosFormulario);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<any>(urlBackServiceGnv, httpParamsknockoutEntity, { headers: mheaders });  

  }

  getDetalleEvaluacionCrediticia(idEvCliente:any,tipoDocumento:any,documento:any):Observable<DetalleEvaluacionCrediticiaModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}EvaluacionCrediticia/GetDetalleEvaluacionCrediticia?idEvalCliente=${idEvCliente}&tipoDocumento=${tipoDocumento}&documento=${documento}`;
    return this.httpClient.get<DetalleEvaluacionCrediticiaModel>(urlBackServiceGnv)
  }

  getDocumentosEvaluacionCrediticia(idPreevaluacion:any):Observable<DescargaDocumentoModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}EvaluacionCrediticia/GetDetalleArchivos?idPreevaluacion=${idPreevaluacion}`;
    return this.httpClient.get<DescargaDocumentoModel>(urlBackServiceGnv)
  }

  postRegistrarEvaluacionCrediticia(datosFormulario: RegistrarEvaluacionCrediticiaModel): Observable<JsonResult<any>> {
    const urlBackServiceGnv = `${this.urlServicesGnv}EvaluacionCrediticia/RegisterEvaluacionCrediticia`;  
    let httpParamsknockoutEntity = JSON.stringify(datosFormulario);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParamsknockoutEntity, { headers: mheaders });  

  }
}
