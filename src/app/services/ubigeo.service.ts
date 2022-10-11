import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DepartamentoModel, DistritoModel, ProvinciaModel } from '../models/ubigeo/ubigeo.model';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {
  urlServicesGnv: string = environment.urlServicesGnv; 

  constructor(private httpClient: HttpClient) { }

  getDepartamentos():Observable<DepartamentoModel>{
    const urlBackServiceGnv = `${this.urlServicesGnv}Ubigeo/ListDepartment`;
    return this.httpClient.get<DepartamentoModel>(urlBackServiceGnv);
  }

  getProvincia(idDepartamento:any):Observable<ProvinciaModel>{
    const urlBackServiceGnv = `${this.urlServicesGnv}Ubigeo/ListProvince?idDepartment=${idDepartamento}`;
    return this.httpClient.get<ProvinciaModel>(urlBackServiceGnv);
  }

  getDistrito(idProvincia:any):Observable<DistritoModel>{
    const urlBackServiceGnv = `${this.urlServicesGnv}Ubigeo/ListDistrict?idProvince=${idProvincia}`;
    return this.httpClient.get<DistritoModel>(urlBackServiceGnv);
  }

}
