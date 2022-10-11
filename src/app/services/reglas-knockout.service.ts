import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JsonResult } from '../models/json-result';
import { KnockoutModel } from '../models/knockout/knockout.model';
import { ListPreevaluacionModel } from 'src/app/models/preevaluacion/list-preevaluacion/list-preevaluacion.model';
import { ListKnockoutModel } from '../models/knockout/list-knockout.model';
import { RespuestaKnockoutModel } from '../models/knockout/rpt-knockout.model';

@Injectable({
  providedIn: 'root'
})
export class ReglasKnockoutService {
  urlServicesGnv: string = environment.urlServicesGnv; 
  constructor(private httpClient: HttpClient) { }

  //registrarKnockoutCliente(strKnockout: KnockoutModel): Observable<JsonResult<any>> { 
    // const urlBackServiceGnv = `${this.urlServicesGnv}Financing/AddPreevaluacion`;  
    // let httpParamsPreevaluacion = JSON.stringify(preevaluacion);
    // let mheaders: HttpHeaders = new HttpHeaders();
    // mheaders = mheaders.append("Content-Type", "application/json"); 
    // return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParamsPreevaluacion, { headers: mheaders });  
  //} 

  getListPreevaluacionClient(): Observable<ListPreevaluacionModel[]>{ 
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/ListAllPreevaluacion`;  
    return this.httpClient.get<ListPreevaluacionModel[]>(urlBackServiceGnv); 
  }

  getPendingPrevaluationClient(codPrevaluation: number): Observable<ListKnockoutModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/GetIdPendingPrevaluation?id=${codPrevaluation}`;
    return this.httpClient.get<ListKnockoutModel>(urlBackServiceGnv)
  }
  
  postRegisterReglasKnockout(knockoutEntity:KnockoutModel): Observable<JsonResult<any>> {
    //const urlBackServiceGnv = `${this.urlServicesGnv}Financing/RegisterKnockoutRules`;  
    //HOMO
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/RegisterKnockoutRules_homo`;  
    let httpParamsknockoutEntity = JSON.stringify(knockoutEntity);
    //////////console.log(JSON.stringify(knockoutEntity))
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParamsknockoutEntity, { headers: mheaders });  

  }

  postActualizarPreevaluacion(idPreevaluacion:number,idEstado:number): Observable<JsonResult<any>>{ 
    const urlBackServiceGnv = `${this.urlServicesGnv}EvaluacionCrediticia/UpdateEstadoPreevaluacion?idPreevaluacion=${idPreevaluacion}&idEstado=${idEstado}`; 
    return this.httpClient.get<JsonResult<any>>(urlBackServiceGnv); 
  }
  

  //Servicio paginación
  getPreevaluationPagination(page:number,size:number,filtro:string,idAsesor:number): Observable<any> {
 
    //const urlBackServiceGnv=(idAsesor==0)?`${this.urlServicesGnv}Financing/AllPrevaluationPag?PageSize=${size}&PageNumber=${page}&Nombre=${filtro}`:`${this.urlServicesGnv}Financing/AllPrevaluationPag?PageSize=${size}&PageNumber=${page}&Nombre=${filtro}&IdAsesor=${idAsesor}`;

    //HOMO
    
    const urlBackServiceGnvTest=(idAsesor==0)?`${this.urlServicesGnv}Financing/AllPrevaluationPag?PageSize=${size}&PageNumber=${page}&Nombre=${filtro}`:`${this.urlServicesGnv}Financing/AllPrevaluationPag?PageSize=${size}&PageNumber=${page}&Nombre=${filtro}&IdAsesor=${idAsesor}`;

    //////////console.log(urlBackServiceGnvTest)
    const urlBackServiceGnv=`${this.urlServicesGnv}Financing/AllPrevaluationPag_homo`;

    let httpParamsknockoutEntity = JSON.stringify({
      "idPreevaluacion": 0,
      "idTipoDocumento": 0,
      "nombre": filtro,
      "apellido": "",
      "numDocumento": "",
      "numPlaca": "",
      "idEstado": 0,
      "numeroPagina": page,
      "numeroRegistros": size,
      "idAsesor": idAsesor
    });

    //////////console.log(httpParamsknockoutEntity)
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<any>(urlBackServiceGnv, httpParamsknockoutEntity, { headers: mheaders });  
  }

  //Validar si la RK existe
  getValidarReglaKnockoutExiste(IdPreevaluacion:number): Observable<RespuestaKnockoutModel> {

    const urlBackServiceGnv=`${this.urlServicesGnv}Financing/GetExistRKByIdPrevaluation?IdPreevaluacion=${IdPreevaluacion}`;

   
    return this.httpClient.get<RespuestaKnockoutModel>(urlBackServiceGnv)
  }

  getValidarPreevaluacionExisteSF(IdPreevaluacion:number): Observable<RespuestaKnockoutModel> {

    const urlBackServiceGnv=`${this.urlServicesGnv}Financing/GetFinancingByIdPreevaluacion?IdPreevaluacion=${IdPreevaluacion}`;

    return this.httpClient.get<RespuestaKnockoutModel>(urlBackServiceGnv)
  }

  getValidarDocumento(IdPreevaluacion:number): Observable<JsonResult<any>>  {

    const urlBackServiceGnv=`${this.urlServicesGnv}EvaluacionCrediticia/ConsultaFormatoSolicitud?idPrevaluacion=${IdPreevaluacion}`;

    return this.httpClient.get<JsonResult<any>>(urlBackServiceGnv)
  }
  


}