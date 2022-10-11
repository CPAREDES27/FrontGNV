import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; 
import { CargaDocumentoModel } from '../models/carga-documentos/cargaDocumento.model';
import { JsonResult } from '../models/json-result';


@Injectable({
  providedIn: 'root'
})
export class CargaDocumentosService {
  urlServicesGnv: string = environment.urlServicesGnv; 
  constructor(private httpClient: HttpClient) { }

  registrarCargaDocumentosSF(cargaDocumento: CargaDocumentoModel): Observable<JsonResult<any>> { 
    //const urlBackServiceGnv = `${this.urlServicesGnv}Financing/AddPreevaluacion`;  
    const urlBackServiceGnv = `${this.urlServicesGnv}FinancingRequest/UploadDocument`;  
    let httpParamsPreevaluacion = JSON.stringify(cargaDocumento);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParamsPreevaluacion, { headers: mheaders });  
  } 

  registrarCargaDocumentosPostAtencion(cargaDocumento: CargaDocumentoModel): Observable<JsonResult<any>> { 
    //const urlBackServiceGnv = `${this.urlServicesGnv}Financing/AddPreevaluacion`;  
    const urlBackServiceGnv = `${this.urlServicesGnv}Postattention/UploadDocumentPostAttention`;  
    let httpParamsPreevaluacion = JSON.stringify(cargaDocumento);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParamsPreevaluacion, { headers: mheaders });  
  } 

  
  

  

}