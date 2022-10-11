import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListAsesoresModel } from '../models/listas/listAsesores.model';
import { ListSelectModel } from '../models/listas/listSelect.model';
import { JsonResult } from '../models/json-result';

@Injectable({
  providedIn: 'root'
})
export class ListSelectService {
  urlServicesGnv: string = environment.urlServicesGnv; 

  constructor(private httpClient: HttpClient) { }



  getListSelect(flag:any):Observable<ListSelectModel>{
    const urlBackServiceGnv = `${this.urlServicesGnv}MaintenanceControl/ListMaintenanceOption?keyOption=${flag}`;
    return this.httpClient.get<ListSelectModel>(urlBackServiceGnv)
  }

  getListAsesores():Observable<ListAsesoresModel>{
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/ListBusinessAdvisors_homo`;
    return this.httpClient.get<ListAsesoresModel>(urlBackServiceGnv)
  }

  updateAsesorPreevaluacion(idPreevaluacion:number,idAsesor:number):Observable<JsonResult<any>>{
    const urlBackServiceGnv = `${this.urlServicesGnv}Financing/UpdateAsesorPrevaluation?IdPreevaluacion=${idPreevaluacion}&IdAsesor=${idAsesor}`;
    let httpParams;
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpParams, { headers: mheaders });  
  }
}

