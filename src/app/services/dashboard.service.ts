import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DashboarModel } from '../models/dashboard/dashboard.model';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  urlServicesGnv: string = environment.urlServicesGnv; 
  constructor(private httpClient: HttpClient) { }

  getArchivosSAP(isUsuario:number,FechaInicio:string,FechaFin:string):Observable<DashboarModel> {

    const urlBackServiceGnv = `${this.urlServicesGnv}ReportDashboard/GetListaReporteSAP?IdUsuario=${isUsuario}&FechaInicio=${FechaInicio}&FechaFin=${FechaFin}`;
    //////console.log(urlBackServiceGnv)
    let httpParamsknockoutEntity;
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
       
    return this.httpClient.post<DashboarModel>(urlBackServiceGnv, httpParamsknockoutEntity, { headers: mheaders });  
  }

  getDashboardAsesor(idAsesor:number,FechaInicio:string,FechaFin:string):Observable<DashboarModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}ReportDashboard/GetDashboarAsesorById?IdAsesor=${idAsesor}&FechaInicio=${FechaInicio}&FechaFin=${FechaFin}`;
    return this.httpClient.get<DashboarModel>(urlBackServiceGnv)
  }

  getDashboardDetalleAsesor(idAsesor:number,FechaInicio:string,FechaFin:string):Observable<DashboarModel> {

    const urlBackServiceGnv = `${this.urlServicesGnv}ReportDashboard/DashboarDetalleAsesorById?IdAsesor=${idAsesor}&FechaInicio=${FechaInicio}&FechaFin=${FechaFin}`;
    let httpParamsknockoutEntity;
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
       
    return this.httpClient.post<DashboarModel>(urlBackServiceGnv, httpParamsknockoutEntity, { headers: mheaders });  
  }

  getDashboardGeneral(idAsesor:number,FechaInicio:string,FechaFin:string):Observable<DashboarModel> {
    const urlBackServiceGnv = `${this.urlServicesGnv}ReportDashboard/GetDashboarGeneral?IdAsesor=${idAsesor}&FechaInicio=${FechaInicio}&FechaFin=${FechaFin}`;
    return this.httpClient.get<DashboarModel>(urlBackServiceGnv)
  }

  getDashboardGeneralDetalle(idAsesor:number,FechaInicio:string,FechaFin:string):Observable<DashboarModel> {

    const urlBackServiceGnv = `${this.urlServicesGnv}ReportDashboard/DashboarGeneralDetalle?IdAsesor=${idAsesor}&FechaInicio=${FechaInicio}&FechaFin=${FechaFin}`;
    let httpParamsknockoutEntity;
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
       
    return this.httpClient.post<DashboarModel>(urlBackServiceGnv, httpParamsknockoutEntity, { headers: mheaders });  
  }


  getGraficoGeneral(idAsesor:number,FechaInicio:string,FechaFin:string):Observable<DashboarModel> {

    const urlBackServiceGnv = `${this.urlServicesGnv}ReportDashboard/GetListaReporteGrafico?IdUsuario=${idAsesor}&FechaInicio=${FechaInicio}&FechaFin=${FechaFin}`;
    let httpParamsknockoutEntity;
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
       
    return this.httpClient.post<DashboarModel>(urlBackServiceGnv, httpParamsknockoutEntity, { headers: mheaders });  
  }
  


}
