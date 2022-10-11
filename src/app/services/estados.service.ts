import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActualizarEstadoModel } from '../models/estados/actualizar-estado.model';
import { EstadoModel } from '../models/estados/estado.model';
import { JsonResult } from '../models/json-result';



@Injectable({
  providedIn: 'root'
})
export class EstadosService {
  urlServicesGnv: string = environment.urlServicesGnv; 
  constructor(private httpClient: HttpClient) { }

  getListEstados(tipoTabla:any):Observable<EstadoModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}MaintenanceControl/ListStateType?tipoTabla=${tipoTabla}`;
    return this.httpClient.get<EstadoModel>(urlBackServiceGnv)
  }


  actualizarEstado(documento: ActualizarEstadoModel): Observable<JsonResult<any>> { 
    //const urlBackServiceGnv = `${this.urlServicesGnv}Financing/AddPreevaluacion`;  
    const urlBackServiceGnv = `${this.urlServicesGnv}EvaluationClient/UpdateStatusFileEvaluationClient`;  
    let httpParamsPreevaluacion = JSON.stringify(documento);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParamsPreevaluacion, { headers: mheaders });  
  } 



}
