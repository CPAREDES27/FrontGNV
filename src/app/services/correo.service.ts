import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; 
import { JsonResult } from '../models/json-result';
import { CorreoModel } from '../models/correo/correo.model';

@Injectable({
  providedIn: 'root'
})
export class CorreoService {

  urlServicesGnv: string = environment.urlServicesGnv; 
  constructor(private httpClient: HttpClient) { }

  postEnviarCorreo(datosCorreo: CorreoModel): Observable<JsonResult<any>> {
    const urlBackServiceGnv = `${this.urlServicesGnv}Email/SendEmail`;  
    let httpCorreo = JSON.stringify(datosCorreo);
    let mheaders: HttpHeaders = new HttpHeaders();
    mheaders = mheaders.append("Content-Type", "application/json"); 
    return this.httpClient.post<JsonResult<any>>(urlBackServiceGnv, httpCorreo, { headers: mheaders });  

  }


}
