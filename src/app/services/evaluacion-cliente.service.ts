import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DetalleEvaluacionClienteModel } from '../models/evaluacion-cliente/detalle-evaluacion-cliente.model';
import { DocumentoEvaluacionClienteModel } from '../models/evaluacion-cliente/documento-evaluacion-cliente.model';
import { EvaluacionClientePaginacionModel } from '../models/evaluacion-cliente/evaluacion-cliente-pag.model';
import { EvaluacionClienteModel } from '../models/evaluacion-cliente/evaluacion-cliente.model';
import { JsonResult } from '../models/json-result';


@Injectable({
  providedIn: 'root'
})
export class EvaluacionClienteService {
  urlServicesGnv: string = environment.urlServicesGnv; 
  constructor(private httpClient: HttpClient) { }

  postListarEvaluacionCliente(datosFormulario: EvaluacionClientePaginacionModel): Observable<any> {
    const urlBackServiceGnv = `${this.urlServicesGnv}EvaluationClient/ListEvaluationclient`;  
    let httpParamsknockoutEntity = JSON.stringify(datosFormulario);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<any>(urlBackServiceGnv, httpParamsknockoutEntity, { headers: mheaders });  

  }

  getDetalleEvaluacionCliente(idEvCliente:any):Observable<DetalleEvaluacionClienteModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}EvaluationClient/GetEvaluationclientById?idevalCliente=${idEvCliente}`;
    return this.httpClient.get<DetalleEvaluacionClienteModel>(urlBackServiceGnv)
  }

  getDocumentosEvaluacionCliente(nombreTabla:string,idreglaKnockout:any):Observable<DocumentoEvaluacionClienteModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/GetDownloadRK_SF?nombre_tabla=${nombreTabla}&id=${idreglaKnockout}`;
    return this.httpClient.get<DocumentoEvaluacionClienteModel>(urlBackServiceGnv)
  }


  postRegisterEvaluacionCliente(datosFormulario: EvaluacionClienteModel): Observable<JsonResult<any>> {
    const urlBackServiceGnv = `${this.urlServicesGnv}EvaluationClient/RegistrarEvaluacionCliente`;  
    let httpParamsknockoutEntity = JSON.stringify(datosFormulario);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParamsknockoutEntity, { headers: mheaders });  

  }

}
