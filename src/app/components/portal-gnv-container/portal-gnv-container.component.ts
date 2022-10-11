import { Component, OnInit } from '@angular/core';
import { AuthorizeModel } from 'src/app/models/authorize.model';
import { AuthorizesService } from 'src/app/services/authorizes.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-portal-gnv-container',
  templateUrl: './portal-gnv-container.component.html',
  styleUrls: ['./portal-gnv-container.component.scss']
})
export class PortalGnvContainerComponent implements OnInit {
  clase: string =  "navopen";
  estado: boolean = true;

  datosUserLogin: AuthorizeModel;
  

  constructor(private loginService:LoginService, private authorizesService:AuthorizesService) { }

  ngOnInit(): void {
    this.obtnerDatosUSer();
  }

   toggleClass(){
    this.clase = (this.estado) ?  "nonavopen" : "navopen";
    this.estado = !this.estado; 
  }

  obtnerDatosUSer(){
    this.datosUserLogin = this.authorizesService.getUserAuth();
  }

  cerrarSesion(){
    this.loginService.logout()
  }

}
