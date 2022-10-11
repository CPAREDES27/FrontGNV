import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { Observable } from 'rxjs';
import { PreevaluacionRequestModel } from 'src/app/models/preevaluacion/prevaluacion-request.model';
import { environment } from 'src/environments/environment'; 
import { JsonResult } from '../models/json-result';
import {DocumentoListarRequestModel} from '../models/documento/ListaDocumento.model'
import { DocumentoGeneralModel } from '../models/documento/documentosGeneral.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  urlServicesGnv: string = environment.urlServicesGnv; 
  constructor(private httpClient: HttpClient) { }

  getListaDocumentos():Observable<DocumentoListarRequestModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/ListRandomQuestions`;
    return this.httpClient.get<DocumentoListarRequestModel>(urlBackServiceGnv)
  }

  getListaDocumentosTotal(idPreevaluacion:number):Observable<DocumentoGeneralModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/GetListIdFinancing?IdPreevaluacion=${idPreevaluacion}`;
    return this.httpClient.get<DocumentoGeneralModel>(urlBackServiceGnv)
  }

  
}
