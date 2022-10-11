import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LineaTiempoModel } from '../models/linea-tiempo/linea-tiempo';


@Injectable({
  providedIn: 'root'
})
export class LineaTiempoService {
  urlServicesGnv: string = environment.urlServicesGnv; 
  constructor(private httpClient: HttpClient) { }


  getListFinanciamientoTemp(clave:string,id:number):Observable<LineaTiempoModel> {
    //const urlBackServiceGnv = `${this.urlServicesGnv}Financing/PrevaluationTipDocEst?IdTipoDocumento=${idTipoDoc}&NumDocumento=${numDoc}`;
    //HOMO
    const urlBackServiceGnv = `${this.urlServicesGnv}FinancingRequest/LineaTiempoPreevaluacion?Clave=${clave}&Id=${id}`;
    return this.httpClient.get<LineaTiempoModel>(urlBackServiceGnv)
  }

}
