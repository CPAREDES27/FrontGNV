import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthorizeModel } from 'src/app/models/authorize.model'
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { MenuOptionsModel } from '../models/menu/menuOptions.model';
import { KnockoutModel } from '../models/knockout/knockout.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorizesService {
  nombreToken: string = "tk";
  urlServicesGnv: string = environment.urlServicesGnv; 

  constructor( private router: Router,
      private httpClient: HttpClient ) { }

  redirectLogin() {
    this.router.navigate(["/"]);
  }

  redirectHome() {
    this.router.navigate(["/gnv/home"]);
  }
  redirectDashboard() {
    this.router.navigate(["/gnv/dashboard"]);
  }

  redirectRegistrarUsuario() {
    this.router.navigate(['/registrar-usuario']);
  }
  redirectPreevaluacion() {
    this.router.navigate(['/preevaluacion']);
  }

  redirectSolicitudPreevaluacion() {
    this.router.navigate(['/solicitud-preevaluacion']);
  }

  grabarToken(token: string) {
    localStorage.setItem(this.nombreToken, token);
  }
 
  redirectReglasKnockout(id:number) {
    this.router.navigate(['/gnv/reglas-Knockout',id]);
  }
  redirectDetalleDocumentoValidacion(id:number) {
    this.router.navigate(['/gnv/detalle-documento',id]);
  }

  redirectDetalleEvaluacionCliente(id:number) {
    this.router.navigate(['/gnv/detalle-eva-cliente',id]);
  }

  redirectListaEvaluacion(){
    this.router.navigate(['/gnv/evaluacion-crediticia']);
  }
  redirectGestionInformacion(idUsuario:number) {
    this.router.navigate(['/gnv/gestion-informacion',idUsuario]);
  }

  redirectDetalleEvaluacionCreditica(id:number,tipoDocumento:string,documento:string,formulario:string,idPreevaluacion:number) {
    if (formulario=="Detalle") {
      this.router.navigate(['/gnv/det-eva-cred',id,tipoDocumento,documento]);
    }
    if (formulario=="Documento") {
      this.router.navigate(['/gnv/doc-adj-eva-cred',id,idPreevaluacion]);
    }
  }

  redirectDetallePostAtencion(id:number,formulario:string,idPreevaluacion:number) {
    if (formulario=="Detalle") {
      this.router.navigate(['/gnv/detalle-expediente',id]);
    }
    if (formulario=="Documento") {
      this.router.navigate(['/gnv/doc-adj-eva-cred',id,idPreevaluacion]);
    }
  }

  getUserAuth(): AuthorizeModel {
    let modelAuth: AuthorizeModel;
    let tk: string = this.getToken();
    if(tk){
      const helper = new JwtHelperService();
      const descodedToken = helper.decodeToken(tk);

      modelAuth = {
        id: descodedToken.id,
        usuario: descodedToken.usuario,
        nombres: descodedToken.nombres,
        apellidos: descodedToken.apellidos,
        razonSocial: descodedToken.razonSocial,
        ruc: descodedToken.ruc,
        rol: descodedToken.rol
      }
    } 
    return modelAuth; 
  }

  getToken(): string{
    return localStorage.getItem(this.nombreToken);
  }

  signOff(){
    localStorage.removeItem(this.nombreToken);
    localStorage.clear();
    this.router.navigate(["/login"]);
  } 
  

  listOptions(rol: string): Observable<MenuOptionsModel[]>{
    const url = `${this.urlServicesGnv}RoleMenu/GetListMenuOpciones_homo?rol=${rol}`; 
    return this.httpClient.get<MenuOptionsModel[]>(url);
  }

}
