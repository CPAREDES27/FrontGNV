import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { LoginRequestModel } from 'src/app/models/login/loginRequest.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators'
import { LoginResponseModel } from 'src/app/models/login/loginResponse.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService { 
    // urlLogin = `${environment.urlServicesGnv}Auth/UsuarioAutenticacion` 
    urlLogin = `${environment.urlServicesGnv}Auth/UserAuthentication` 
    constructor(
    private http: HttpClient,private router: Router) 
    { } 

    authenticateUser(login: LoginRequestModel): Observable<LoginResponseModel> {  
      
      let loginJson = JSON.stringify(login);
      let misHeader: HttpHeaders = new HttpHeaders(); 
      misHeader = misHeader.append("Content-Type", "application/json");
      return this.http.post<LoginResponseModel>(
        this.urlLogin, loginJson, { headers: misHeader })
        .pipe(
          map((valor: any) => {
            return {
              tk: valor.token,
              code: valor.codigo,
              estado: valor.valid,
              message: valor.message
            };
          })
        ); 
    }

    logout(){
      localStorage.clear();
      this.router.navigate(['/login']); 
    }

}
