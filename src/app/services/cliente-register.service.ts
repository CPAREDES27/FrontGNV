import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { Observable } from 'rxjs';
import { PreevaluacionRequestModel } from 'src/app/models/preevaluacion/prevaluacion-request.model';
import { environment } from 'src/environments/environment'; 
import { JsonResult } from '../models/json-result';
import { PreevaluacionResponseModel } from '../models/preevaluacion/prevaluacion-response.mode';
import { UsuarioRegistrarRequestModel } from '../models/usuario-registrar/usuario-registrar-request.model';
import { UsuariofinanciamientoModel } from '../models/usuarios/usuarioFinanciamiento.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteRegisterService {
  urlServicesGnv: string = environment.urlServicesGnv; 
  constructor(private httpClient: HttpClient) { }

  registrarPreevaluacion(preevaluacion: PreevaluacionRequestModel): Observable<PreevaluacionResponseModel> { 
    //HOMO
    //const urlBackServiceGnv = `${this.urlServicesGnv}Financing/RegisterClientPrevaluation`;  
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/RegisterClientPreevaluation_homo`;  

    if (preevaluacion.direccionSentinel == null){preevaluacion.direccionSentinel="";}
    if (preevaluacion.fechaNacimiento == null){ preevaluacion.fechaNacimiento ="";}
    let httpParamsPreevaluacion = JSON.stringify(preevaluacion);
    //////////console.log(httpParamsPreevaluacion)
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<PreevaluacionResponseModel>(urlBackServiceGnv, httpParamsPreevaluacion, { headers: mheaders });  
  } 

  registrarClientePersona(usuarioNaturalEntity: UsuarioRegistrarRequestModel): Observable<JsonResult<any>> { 
    // const urlBackServiceGnv = `${this.urlServicesGnv}User/ExcRegistrarNuevoUsuario`;  => antiguo
    const urlBackServiceGnv = `${this.urlServicesGnv}User/CustomerRegister`;  
    let httpParamsPersonaNatural = JSON.stringify(usuarioNaturalEntity);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParamsPersonaNatural, { headers: mheaders });  
  } 

  registrarClienteEmpresa(usuarioJuridicoEntity: UsuarioRegistrarRequestModel): Observable<JsonResult<any>> { 
    const urlBackServiceGnv = `${this.urlServicesGnv}User/CustomerRegister`;  
    let httpParamsPersonaJuridica = JSON.stringify(usuarioJuridicoEntity);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParamsPersonaJuridica, { headers: mheaders });  
  } 

  
  getValidarUsuario(correo:string):Observable<JsonResult<any>> {
    const urlBackServiceGnv = `${this.urlServicesGnv}User/ValidarUsuarioEstado?usuarioemail=${correo}`;
    ////////////////console.log(urlBackServiceGnv)
    return this.httpClient.get<JsonResult<any>>(urlBackServiceGnv)
  }

  getObtenerUltimaSolicitud(idUsuario:number):Observable<UsuariofinanciamientoModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}FinancingRequest/LastRegPreevaluacion?IdUsuario=${idUsuario}`;
    ////////////////console.log(urlBackServiceGnv)
    return this.httpClient.get<UsuariofinanciamientoModel>(urlBackServiceGnv)
  }

  

}
