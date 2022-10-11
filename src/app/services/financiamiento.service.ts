import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EstadoCivilModel } from '../models/financiamiento/estadoCivil.model';
import { EstadoVehicularModel } from '../models/financiamiento/estadoVehicular.model';
import { ListaPreguntasModel } from '../models/financiamiento/ListaPReguntas.model';
import { NivelEstudioModel } from '../models/financiamiento/nivelEstudio.model';

import { SolicitudFinanciamientoModel } from '../models/financiamiento/solicitudFinanciamiento.model';
import { ListaTalleresModel } from '../models/financiamiento/talleres.model';
import { TipoCalleModel } from '../models/financiamiento/tipoCalle.model';
import { TipoCreditoFinanciamientoModel } from '../models/financiamiento/tipoCreditoFinanciamiento.model';
import { TipoFinanciamientoModel } from '../models/financiamiento/tipoFinanciamiento.model';
import { UltimoFinanciamientoModel } from '../models/financiamiento/ultimoFinanciamiento';
import { JsonResult } from '../models/json-result';
import { ProductoPreevaluacionModel } from '../models/productos/producto-preevaluacion.model';

@Injectable({
  providedIn: 'root'
})
export class FinanciamientoService {
  urlServicesGnv: string = environment.urlServicesGnv; 
  constructor(private httpClient: HttpClient) { }

  getListFinanciamiento(idTipoDoc:number,numDoc:string,numPagina:number,numRegistro:number):Observable<any> {
    //const urlBackServiceGnv = `${this.urlServicesGnv}Financing/PrevaluationTipDocEst?IdTipoDocumento=${idTipoDoc}&NumDocumento=${numDoc}`;
    //HOMO
    const urlBackServiceGnv = `${this.urlServicesGnv}FinancingRequest/List40Preguntas?IdtipoDocumento=${idTipoDoc}&NumDocumento=${numDoc}&NumPag=${numPagina}&NumReg=${numRegistro}`;
    return this.httpClient.get<any>(urlBackServiceGnv)
  }

  getListTalleres(filtro:any,idProveedor:number,idTipoProducto:number):Observable<ListaTalleresModel> {
    let urlBackServiceGnv='';
    if (idTipoProducto==1) {
      urlBackServiceGnv = `${this.urlServicesGnv}FinancingRequest/ListServiceCenter?nombre=${filtro}`;
    }else{
      urlBackServiceGnv = `${this.urlServicesGnv}FinancingRequest/ListServiceCenter?nombre=${filtro}&idProveedor=${idProveedor}`;
    }
    return this.httpClient.get<ListaTalleresModel>(urlBackServiceGnv)
  }
  

  postRegisterReglasKnockout(datosFormulario: SolicitudFinanciamientoModel): Observable<JsonResult<any>> {
    const urlBackServiceGnv = `${this.urlServicesGnv}FinancingRequest/CustomerFinancingRecord`;  
    let httpParamsknockoutEntity = JSON.stringify(datosFormulario);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParamsknockoutEntity, { headers: mheaders });  

  }

  getPreguntasAleatorias():Observable<ListaPreguntasModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/ListRandomQuestions_homo`;
    return this.httpClient.get<ListaPreguntasModel>(urlBackServiceGnv)
  }

  getListProductByTipoNumDoc(idTipoDoc:number,numDoc:string):Observable<ProductoPreevaluacionModel> {
    //const urlBackServiceGnv = `${this.urlServicesGnv}Financing/PrevaluationTipDocEst?IdTipoDocumento=${idTipoDoc}&NumDocumento=${numDoc}`;
    //HOMO
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/PrevaluationTipDocEst_homo?IdTipoDocumento=${idTipoDoc}&NumDocumento=${numDoc}`;
    return this.httpClient.get<ProductoPreevaluacionModel>(urlBackServiceGnv)
  }

  getEstadoNivelEstudiosCliente():Observable<NivelEstudioModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/GetEstadoNivelEstudiosCliente`;
    return this.httpClient.get<NivelEstudioModel>(urlBackServiceGnv)
  }
  getEstadoCivilCliente():Observable<EstadoCivilModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/GetEstadoCivilCliente`;
    return this.httpClient.get<EstadoCivilModel>(urlBackServiceGnv)
  }
  getTipoCalle():Observable<TipoCalleModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/GetTipoCalle`;
    return this.httpClient.get<TipoCalleModel>(urlBackServiceGnv)
  }
  getEstadoVehicular():Observable<EstadoVehicularModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/GetEstadoVehicular`;
    return this.httpClient.get<EstadoVehicularModel>(urlBackServiceGnv)
  }
  getTipoFinanciamiento():Observable<TipoFinanciamientoModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/GetEstadoTipoFinanciamiento`;
    return this.httpClient.get<TipoFinanciamientoModel>(urlBackServiceGnv)
  }
  getTipoCreditoFinanciamiento():Observable<TipoCreditoFinanciamientoModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/GetTipoCreditoFinanciamiento`;
    return this.httpClient.get<TipoCreditoFinanciamientoModel>(urlBackServiceGnv)
  }

  getUltimoFinanciamiento(idUsuario:number):Observable<UltimoFinanciamientoModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}FinancingRequest/LastReg40Preguntas?IdUsuario=${idUsuario}`;
    return this.httpClient.get<UltimoFinanciamientoModel>(urlBackServiceGnv)
  }

  // guardarEncuestaRespondida(datosEncuesta: RespuestaPreguntaModel): Observable<JsonResult<any>>{
  //   const urlBackServiceGnv = `${this.urlServicesGnv}Financing/RecordSurveyResponse`;  
  //   let httpParams = JSON.stringify(datosEncuesta);
  //   let mheaders: HttpHeaders = new HttpHeaders();
  //   mheaders = mheaders.append("Content-Type", "application/json"); 
  //   return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParams, { headers: mheaders });
  // }

}
