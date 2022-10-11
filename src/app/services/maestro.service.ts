import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { Observable } from 'rxjs';
import { PreevaluacionRequestModel } from 'src/app/models/preevaluacion/prevaluacion-request.model';
import { environment } from 'src/environments/environment'; 
import { JsonResult } from '../models/json-result';
import {DocumentoListarRequestModel} from '../models/documento/ListaDocumento.model'
import { MaestroModel } from '../models/maestro/maestro.model';
import { LineaCreditoModel } from '../models/linea-credito/linea-credito';

@Injectable({
  providedIn: 'root'
})
export class MaestroService {

  urlServicesGnv: string = environment.urlServicesGnv; 
  constructor(private httpClient: HttpClient) { }


  getMaestroByClave(maestro:MaestroModel): Observable<JsonResult<any>> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/GetDownloadMaestro`;  
    let httpParamsknockoutEntity = JSON.stringify(maestro);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParamsknockoutEntity, { headers: mheaders });  

  }

  getLineaCredito(score:number,valorCR):Observable<LineaCreditoModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}FinancingRequest/LineaCredito?NumScore=${score}&ValorCR=${valorCR}`;
    return this.httpClient.get<LineaCreditoModel>(urlBackServiceGnv)
  }
}
