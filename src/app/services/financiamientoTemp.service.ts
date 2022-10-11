import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EstadoCivilModel } from '../models/financiamiento/estadoCivil.model';
import { EstadoVehicularModel } from '../models/financiamiento/estadoVehicular.model';
import { FinanciamientoTempModel } from '../models/financiamiento/financiamientoTemp.model';
import { ListaPreguntasModel } from '../models/financiamiento/ListaPReguntas.model';
import { NivelEstudioModel } from '../models/financiamiento/nivelEstudio.model';

import { SolicitudFinanciamientoModel } from '../models/financiamiento/solicitudFinanciamiento.model';
import { ListaTalleresModel } from '../models/financiamiento/talleres.model';
import { TipoCalleModel } from '../models/financiamiento/tipoCalle.model';
import { TipoCreditoFinanciamientoModel } from '../models/financiamiento/tipoCreditoFinanciamiento.model';
import { TipoFinanciamientoModel } from '../models/financiamiento/tipoFinanciamiento.model';
import { JsonResult } from '../models/json-result';
import { ProductoPreevaluacionModel } from '../models/productos/producto-preevaluacion.model';

@Injectable({
  providedIn: 'root'
})
export class FinanciamientoTempService {
  urlServicesGnv: string = environment.urlServicesGnv; 
  constructor(private httpClient: HttpClient) { }

 

  postRegisterReglasKnockoutTemp(datosFormulario: SolicitudFinanciamientoModel): Observable<JsonResult<any>> {
    const urlBackServiceGnv = `${this.urlServicesGnv}FinancingRequest/CustomerFinancingRecordTemp`;  
    let httpParamsknockoutEntity = JSON.stringify(datosFormulario);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParamsknockoutEntity, { headers: mheaders });  

  }

  getListFinanciamientoTemp(idTipoDoc:number,numDoc:string,numPagina:number,numRegistro:number):Observable<any> {
    //const urlBackServiceGnv = `${this.urlServicesGnv}Financing/PrevaluationTipDocEst?IdTipoDocumento=${idTipoDoc}&NumDocumento=${numDoc}`;
    //HOMO
    const urlBackServiceGnv = `${this.urlServicesGnv}FinancingRequest/ListTempSolicitud?IdtipoDocumento=${idTipoDoc}&NumDocumento=${numDoc}&NumPag=${numPagina}&NumReg=${numRegistro}`;
    return this.httpClient.get<any>(urlBackServiceGnv)
  }

  getByIdFinanciamientoTemp(idsfcliente:number):Observable<SolicitudFinanciamientoModel>  {
    //const urlBackServiceGnv = `${this.urlServicesGnv}Financing/PrevaluationTipDocEst?IdTipoDocumento=${idTipoDoc}&NumDocumento=${numDoc}`;
    //HOMO
    const urlBackServiceGnv = `${this.urlServicesGnv}FinancingRequest/GetTempSolicitudById?IdSfCliente=${idsfcliente}`;
    return this.httpClient.get<SolicitudFinanciamientoModel>(urlBackServiceGnv)
  }




}
