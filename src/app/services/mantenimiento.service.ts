import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EncuestaModel } from '../models/encuesta/encuesta.model';
import { OpcionesModel, PreguntasModel } from '../models/encuesta/listaEncuesta.model';
import { JsonResult } from '../models/json-result';
import { AllUsuariosModel, UsuarioModel } from '../models/usuarios/usuario.model';
import { DatosAdicionalesUsuario } from '../models/usuarios/usuarioDatosAdicionales.model';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {
  urlServicesGnv: string = environment.urlServicesGnv; 
  constructor(private httpClient: HttpClient) { }
  
  // ============  USUARIO ===========

  registrarUsuario(datosUser: UsuarioModel): Observable<JsonResult<any>> { 
    const urlBackServiceGnv = `${this.urlServicesGnv}User/UserRecordMaintenance`;  
    let httpParams = JSON.stringify(datosUser);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParams, { headers: mheaders });  
  } 

  eliminarUsuario(idUsuario,idLogin): Observable<JsonResult<any>> { 
    //////////////////////////console.log(idUsuario)
    //////////////////////////console.log(idLogin)

    const urlBackServiceGnv = `${this.urlServicesGnv}User/UserDeleteMaintenance_homo?idUsuario=${idUsuario}&idUsuarioLog=${idLogin}`;  
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.get<JsonResult<any>>(urlBackServiceGnv, { headers: mheaders });  
  } 

  getUsuarioPorId(id: number): Observable<UsuarioModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}User/SelectMaintenanceUser?idUsuario=${id}`;
    return this.httpClient.get<UsuarioModel>(urlBackServiceGnv)
  }

  modificarUsuario(datosUser: UsuarioModel): Observable<JsonResult<any>> { 
    const urlBackServiceGnv = `${this.urlServicesGnv}User/UserUpdateMaintenance`;  
    let httpParams = JSON.stringify(datosUser);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParams, { headers: mheaders });  
  } 

  consultarDatosAdicionales(idUsuario: number,idPreevaluacion: number): Observable<DatosAdicionalesUsuario> {

    const urlBackServiceGnv = `${this.urlServicesGnv}User/ConsultaDatosAdicionalesUsuarioById?idUsuario=${idUsuario}&IdPreevaluacion=${idPreevaluacion}`;
    return this.httpClient.get<DatosAdicionalesUsuario>(urlBackServiceGnv)
  }

  insertarActualizarDatosAdicionales(datosAdicionalesCliente: DatosAdicionalesUsuario): Observable<JsonResult<any>> {
    const urlBackServiceGnv = `${this.urlServicesGnv}User/UserRecordDatosAdicionales`;  
    let httpParams = JSON.stringify(datosAdicionalesCliente);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParams, { headers: mheaders });  

  }

  // getAllUsuarios() : Observable<AllUsuariosModel>{
  //   const urlBackServiceGnv = `${this.urlServicesGnv}User/UserListMaintenance?PageSize=50&PageNumber=1`;
  //   return this.httpClient.get<AllUsuariosModel>(urlBackServiceGnv)
  // }

  getSentinelService(tipoDocumento:string, numeroDocumento:string):Observable<any>{
    const urlBackServiceGnv = `${this.urlServicesGnv}Sentinel/ObtenerDatosUsuario`;
    let httpParams = JSON.stringify({
      "tipoDocumento": tipoDocumento,
      "numeroDocumento": numeroDocumento
    });
    ////////console.log(httpParams)
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<any>(urlBackServiceGnv, httpParams, { headers: mheaders }); 
  }
  getAllUsuariosPaginado(page:number,size:number,rolId:number,nDocumento:string) : Observable<any>{

    /* const urlBackServiceGnv = `${this.urlServicesGnv}User/UserListMaintenance_homo?PageSize=${size}&PageNumber=${page}&RolId=${rolId}&NumDocumento=${nDocumento}`;
    return this.httpClient.get<any>(urlBackServiceGnv) */

    const urlBackServiceGnv = `${this.urlServicesGnv}User/UserListMaintenance_homo`;
    let httpParams = JSON.stringify({
      "numeroPagina": page,
      "numeroRegistros": size,
      "rolId": rolId,
      "numDocumento": nDocumento
    });
    //////////console.log(httpParams)
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<any>(urlBackServiceGnv, httpParams, { headers: mheaders }); 

  }

  getAllUsuariosPaginadoMant(page:number,size:number,rolId:number,nDocumento:string) : Observable<any>{

    /* const urlBackServiceGnv = `${this.urlServicesGnv}User/UserListMaintenance_homo?PageSize=${size}&PageNumber=${page}&RolId=${rolId}&NumDocumento=${nDocumento}`;
    return this.httpClient.get<any>(urlBackServiceGnv) */

    const urlBackServiceGnv = `${this.urlServicesGnv}User/UserListEstadoMaintenance`;
    let httpParams = JSON.stringify({
      "numeroPagina": page,
      "numeroRegistros": size,
      "rolId": rolId,
      "idEstado": 0,
      "numDocumento": nDocumento
    });
    ////////console.log(httpParams)
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<any>(urlBackServiceGnv, httpParams, { headers: mheaders }); 

  }
  // ============  ENCUESTA ===========

  registrarEncuesta(datosEncuesta: EncuestaModel): Observable<JsonResult<any>> { 
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/RegisterRandomQuestions_homo`;  
    let httpParams = JSON.stringify(datosEncuesta);
    //////////console.log(httpParams)
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParams, { headers: mheaders });  
  } 

  getAllEncuesta() : Observable<PreguntasModel>{
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/ListRandomQuestions2_homo`;
    return this.httpClient.get<PreguntasModel>(urlBackServiceGnv)
  }
  
  getEncuestaPorId(id: number): Observable<PreguntasModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/ListRandomQuestionsId_homo?idPregunta=${id}`;
    return this.httpClient.get<PreguntasModel>(urlBackServiceGnv)
  }

  modificarEncuesta(datosEncuesta: PreguntasModel): Observable<JsonResult<any>> { 
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/UpdateRandomQuestions_homo`;  
    let httpParams = JSON.stringify(datosEncuesta);
    //////////console.log(httpParams)
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParams, { headers: mheaders });  
  } 

  eliminarPregunta(data): Observable<JsonResult<any>> { 
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/DeleteRandomQuestions`;  
    let httpParams = JSON.stringify(data);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv,httpParams, { headers: mheaders });  
  } 


  //REGISTRAR ENCUESTA RESPONDIDA
  registrarEncuestaRespuestas(datosEncuesta: any): Observable<JsonResult<any>> { 
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/RecordSurveyResponse`;  
    let httpParams = JSON.stringify(datosEncuesta);
    //////////////////////////console.log(httpParams)

    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParams, { headers: mheaders });  
  } 

}
